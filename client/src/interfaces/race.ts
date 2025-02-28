export interface Race {
    id: number;
    name: string;
    date: string; // ISO date string or Date object
    distance: number;
    weatherConditions: string | null;
    raceresults: RaceResult[];
}

export interface RaceResult {
    id: number;
    pigeonId: number;
    raceId: number;
    finishTime: string; 
    speed: number | null;
    pigeonName: string; 
}