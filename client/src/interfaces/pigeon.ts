export interface Pigeon {
    id: number;
    userId: number;
    name: string;
    ringNumber: string;
}

export interface PigeonRequest {
    name: string;
    ringNumber: string;
}