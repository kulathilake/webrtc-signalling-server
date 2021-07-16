import { ActivePeerConnection, ConnectionRequest, PeerConnection, Signal } from "./types";

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
    acknowledgeAllRequests(userid: string){
        this.connectionRequests.forEach(request=>{
            if(request.targetUserId === userid){
                request.sourceConnection.send('User Ready');
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
                    conn.send({
                        type: 'connection',
                        payload: {
                            user: userid,
                            state: 'disconnected'
                        }
                    } as Signal<PeerConnection>);
                })
            }
            return conn.userid !== userid
        });
    }
}