import { connection } from "websocket";

export type User = {
    username: string;
}


export type Init = {
    eventId: string;
    sender: User;
    receiever: User;
}

export type ActivePeerConnection = {
    userid: string;
    peers: connection[];
    connection: connection;
}

export type ConnectionRequest = {
    targetUserId: string;
    sourceUserId: string;
    sourceConnection: connection;
    candidates: RTCIceCandidate[]
}

// Inbound Signals
export type InboundSignal<T> = {
    type: 'candidate' | 'description' | 'init' | 'terminate' | 'info';
    payload?: T ; 
    from?: string;
}

// Two Way Signals
export type PeerICEExchange = {
    candidate: RTCIceCandidate;
    to: string;
    from: string;
}

export type PeerICESession = {
    description: RTCSessionDescription;
    to: string;
    from: string;
}

// Outbound Signals
export type OutboundSignal<T> = {
    type: 'candidate' | 'desc' | 'connection' | 'info';
    payload: T;
}

export type PeerConnection = {
    user: string;
    state: 'ready' | 'pending' | 'disconnected';
}

export type Info = {
    message: string
}
