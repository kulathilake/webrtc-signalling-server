import { connection } from "websocket";
import PeerConnectionQueue from "../conn-queue";
import { Init, PeerConnection, Signal } from "../types";

export default function handleInitRequests(data:Init,store:PeerConnectionQueue,conn: connection){
   store.addActiveConnection({
       userid: data.sender.username,
       connection: conn,
       peers: []
   });


   /** Check if the sender is in the pending connection list as a target and sends user ready to all*/
   store.acknowledgeAllRequests(data.sender.username);
   /** Check if the target user is in active connections and send back User Ready*/
   /** Also add the current connection as a peer to the target user's active connection */
   /** If a reciepient user is not active, add connection to a pending connection list */
   const activeConn = store.activeConnections.find(conn => conn.userid === data.receiever.username);
   if(activeConn){
       activeConn.connection.send("Connection Initiation Request from " + data.sender.username);
       activeConn.peers.push(conn);
       conn.send({
           type: 'connection',
           payload: {
               user: data.receiever.username,
               state: 'ready'
           }
       } as Signal<PeerConnection>);
       return;
   } else {
       store.addConnectionRequest({
           targetUserId: data.receiever.username,
           sourceUserId: data.sender.username,
           sourceConnection: conn
       });
       conn.send({
           type: 'connection',
           payload: {
               user: data.receiever.username,
               state: 'pending'
           }
       } as Signal<PeerConnection>);
       return;
   }


}