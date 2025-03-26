import { useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Pigeon, PigeonRequest } from '../interfaces/pigeon';
import { toast } from 'react-toastify';

// Accept state as an argument
export const useCreatePigeon = ({ setPigeons, setLoading, setError }) => {
    const createPigeon = useCallback(
        async (data: PigeonRequest) => {
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
        },
        [setPigeons, setLoading, setError] // Add dependencies
    );

    return { createPigeon };
};