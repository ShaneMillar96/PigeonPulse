export interface Pigeon {
    id: number;
    userId: number;
    name: string;
    imageUrl: string;
    ringNumber: string;
    color: string;
    strain: string;
}

export interface PigeonRequest {
    name: string;
    ringNumber: string;
}