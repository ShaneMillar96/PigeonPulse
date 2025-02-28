export interface Race {
    id: number;
    name: string;
    date: string; 
    distance: number;
    weatherConditions: string;
}

export interface RaceResult {
    id: number;
    pigeonId: number;
    raceId: number;
    finishTime: string; 
    speed: number;
}