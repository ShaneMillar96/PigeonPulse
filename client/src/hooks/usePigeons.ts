import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Pigeon, PigeonRequest } from '../interfaces/pigeon';

export const usePigeons = () => {
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false); // Track if we've attempted to fetch

    const fetchPigeons = useCallback(async (userId: number) => {
        if (hasFetched && error) return; // Prevent re-fetching if it failed previously

        setLoading(true);
        try {
            const response = await axiosInstance.get<Pigeon[]>(`/pigeon/user/${userId}`);
            setPigeons(response.data);
            setError(null);
            setHasFetched(true); // Mark as fetched
        } catch (err) {
            setError('Failed to fetch pigeons');
        } finally {
            setLoading(false);
        }
    }, [hasFetched, error]); // Dependencies: only re-create if hasFetched or error changes

    const createPigeon = async (userId: number, data: PigeonRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<Pigeon>(`/pigeon?userId=${userId}`, data);
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