import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Pigeon, PigeonRequest } from '../interfaces/pigeon';
import { toast } from 'react-toastify';

export const usePigeons = () => {
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPigeons = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Pigeon[]>('/pigeon'); // Updated to match backend endpoint
            setPigeons(response.data);
            setError(null);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch pigeons';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPigeon = async (data: PigeonRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<Pigeon>('/pigeon', data);
            setPigeons((prev) => [...prev, response.data]);
            setError(null);
            toast.success('Pigeon created successfully!');
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create pigeon';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { pigeons, loading, error, fetchPigeons, createPigeon };
};