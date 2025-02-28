import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Pigeon, PigeonRequest } from '../interfaces/pigeon';

export const usePigeons = () => {
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPigeons = async (userId: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Pigeon[]>(`/pigeon/user/${userId}`);
            setPigeons(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch pigeons');
        } finally {
            setLoading(false);
        }
    };

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