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
}

// Outbound Signals
export type Signal<T> = {
    type: 'candidate' | 'desc' | 'connection' | 'info';
    payload: T;
}

export type PeerConnection = {
    user: string;
    state: 'ready' | 'pending' | 'disconnected';
}