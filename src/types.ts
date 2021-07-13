export type User = {
    username: string;
}

export type Signal<T> = {
    type: 'candidate' | 'description' | 'init',
    payload: T
};

export type Init = {
    eventId: string;
    sender: User;
    receiever: User;
}