import { connection } from "websocket";
import { ActivePeerConnection, ConnectionRequest, PeerConnection, OutboundSignal, PeerICEExchange } from "./types";

export default class PeerConnectionQueue{
    activeConnections: ActivePeerConnection[];
    connectionRequests: ConnectionRequest[];
    constructor(){
        this.activeConnections = [];
        this.connectionRequests = [];
    }

    /**
     * Stores Reciever ID and requestor connections in memory.
     * @param data 
     */
    addActiveConnection(data:ActivePeerConnection){ 
       this.activeConnections.push(data);
    }

    /**
     * Adds a ConnectionRequest to the connectionRequests list
     * @param data 
     */
    addConnectionRequest(data:ConnectionRequest){
        this.connectionRequests.push(data);
    }

    /**
     * Sends Ready to all pending connection requests under a userid
     * @param userid 
     */
    acknowledgeAllRequests(userid: string,conn: connection){
        console.log("Acknowledging All Pending Requests for: " + userid);
        this.connectionRequests.forEach(request=>{
            if(request.targetUserId === userid){
                console.log("Pending Request Found from: " + request.sourceUserId)
                request.sourceConnection.send(JSON.stringify({
                    type: 'connection',
                    payload: {
                        user: userid,
                        state: 'ready'
                    }
                } as OutboundSignal<PeerConnection>));
                console.log("Finding ICE candidates in this pending request")
                request.candidates.forEach(candidate => {
                    console.log("Sending ICE Candidates from " + request.sourceUserId + " to " + userid);
                    conn.send(JSON.stringify({
                        type: 'candidate',
                        payload: {
                            candidate: candidate,
                            from: request.sourceUserId,
                            to: request.targetUserId
                        }
                    } as OutboundSignal<PeerICEExchange>))
                })
            }
        });
    };

    /** Removes a user's connections and sends User Disconnected to all peers.
     * @param userid
    */
    removeConnectionsByUser(userid:string){
        this.activeConnections = this.activeConnections.filter(conn=>{
            if(conn.userid === userid){
                conn.peers.forEach(conn=>{
                    conn.send(JSON.stringify({
                        type: 'connection',
                        payload: {
                            user: userid,
                            state: 'disconnected'
                        }
                    } as OutboundSignal<PeerConnection>));
                })
            }
            return conn.userid !== userid
        });
    }
}