export interface QueueClient {
    userId: string | null;
    appointmentId: string | null;
    code: string;
    window: string | null;
    serviceDuration: number | null;
    serviceStartedOn: number | null;
}

export interface Queue {
    id: string;
    name: string;
    clients: QueueClient[];
}

export default Queue;