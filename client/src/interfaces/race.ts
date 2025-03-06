export interface Race {
    id: number;
    name: string;
    date: string;
    distance: number;
    weatherConditions: string | null;
    raceStatus: RaceStatus;
    raceresults: RaceResult[];
    baskets: Basket[];
}

export interface RaceResult {
    id: number;
    pigeonId: number;
    raceId: number;
    finishTime: string;
    speed: number | null;
    pigeonName: string;
}

export interface RaceStatus {
    id: number;
    name: string;
}

export interface Basket {
    id: number;
    userId: number;
    pigeonId: number;
    raceId: number;
    basketedAt: string;
    pigeonName: string;
}

export interface Pigeon {
    id: number;
    userId: number;
    name: string;
    ringNumber: string;
    createdDate: string; 
}

export interface PigeonResponse {
    data: Pigeon[];
    totalCount: number;
}