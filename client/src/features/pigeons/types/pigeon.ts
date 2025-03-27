export interface Pigeon {
    id: number;
    ringNumber: string;
    color?: string;
    imageUrl?: string;
    createdDate?: string;
    sex?: string;
    fatherId?: number;
    motherId?: number;
}

export interface PigeonRequest {
    ringNumber: string;
    color?: string;
    imageUrl?: string;
    sex?: string;
}

export interface PigeonResponse {
    data: Pigeon[];
    totalCount: number;
}

export interface NewPigeon {
    ringNumber: string;
    color: string;
    sex: string;
}

export interface PedigreeNodeType extends Pigeon {
    father?: PedigreeNodeType;
    mother?: PedigreeNodeType;
}