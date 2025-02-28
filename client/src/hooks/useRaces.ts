import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Race, RaceResult } from '../interfaces/race'; 

export const useRaces = () => {
    const [races, setRaces] = useState<Race[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchRaces = useCallback(async () => {
        if (hasFetched && error) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get<Race[]>('/race'); 
            setRaces(response.data);
            setError(null);
            setHasFetched(true);
        } catch (err) {
            setError('Failed to fetch races');
        } finally {
            setLoading(false);
        }
    }, [hasFetched, error]);

    return { races, loading, error, fetchRaces };
};