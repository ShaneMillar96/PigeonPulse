import { useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Pigeon } from '../interfaces/pigeon';

export const useGetPigeonById = () => {
    const getPigeonById = useCallback(async (pigeonId: number): Promise<Pigeon | null> => {
        try {
            const response = await axiosInstance.get<Pigeon>(`/pigeon/${pigeonId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pigeon by ID:', error);
            return null;
        }
    }, []);

    return { getPigeonById };
};