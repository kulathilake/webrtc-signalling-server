import PeerConnectionQueue from "../conn-queue";

export function handleTerminateRequests(userid:string,store:PeerConnectionQueue){
    store.removeConnectionsByUser(userid);
}