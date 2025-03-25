export interface Pigeon {
    id: number;
    ringNumber: string;
    color?: string;
    strain?: string;
    imageUrl?: string;
    createdDate?: string;
    sex?: string;
}

export interface PigeonRequest {
    ringNumber: string;
    color?: string;
    strain?: string;
    imageUrl?: string;
    sex?: string;
}

export interface PigeonResponse {
    data: Pigeon[];
    totalCount: number;
}