import { useState } from 'react';
import { Race } from '../';

export const useRacesState = () => {
    const [races, setRaces] = useState<Race[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return {
        races,
        setRaces,
        loading,
        setLoading,
        error,
        setError,
    };
};