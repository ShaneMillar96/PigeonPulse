import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Pigeon, PigeonRequest } from '../interfaces/pigeon';

export const usePigeons = () => {
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchPigeons = useCallback(async () => {
        if (hasFetched && error) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get<Pigeon[]>('/pigeon'); // New endpoint
            setPigeons(response.data);
            setError(null);
            setHasFetched(true);
        } catch (err) {
            setError('Failed to fetch pigeons');
        } finally {
            setLoading(false);
        }
    }, [hasFetched, error]);

    const createPigeon = async (data: PigeonRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<Pigeon>('/pigeon', data);
            setPigeons((prev) => [...prev, response.data]);
            setError(null);
        } catch (err) {
            setError('Failed to create pigeon');
        } finally {
            setLoading(false);
        }
    };

    return { pigeons, loading, error, fetchPigeons, createPigeon };
};