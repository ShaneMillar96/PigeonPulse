export interface Pigeon {
    id: number;
    name: string;
    ringNumber: string;
    color?: string;
    strain?: string;
    imageUrl?: string;
    createdDate?: string;
}

export interface PigeonRequest {
    name: string;
    ringNumber: string;
    color?: string;
    strain?: string;
    imageUrl?: string;
}

export interface PigeonResponse {
    data: Pigeon[];
    totalCount: number;
}