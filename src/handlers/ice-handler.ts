import { connection } from "websocket";
import PeerConnectionQueue from "../conn-queue";
import { OutboundSignal, PeerConnection, PeerICEExchange } from "../types";

export default function handleICEExchange(data: PeerICEExchange, store: PeerConnectionQueue, conn: connection){
    /**
     * If the target user has an active conn. send candidate
     * If the target user has a pending request from the sender, add candidate to candidates list.
     * If the target user has none, create new pending request and add the candidate to candidates list.
     */
    const targetConn = store.activeConnections.find(conn => conn.userid === data.to);
    const connReq = store.connectionRequests.find(req => (req.targetUserId === data.to && req.sourceUserId === data.from));
    if(!!targetConn){
        targetConn.connection.send(JSON.stringify({
            type:'candidate',
            payload: {
                candidate: data.candidate,
                from: data.from,
                to: data.to
            }
        } as OutboundSignal<PeerICEExchange>))

    }else if (!!connReq){
       connReq.candidates.push(data.candidate)
    } else {
        store.addConnectionRequest({
            sourceConnection: conn,
            sourceUserId: data.from,
            targetUserId: data.to,
            candidates: [data.candidate]
        })
    }
}