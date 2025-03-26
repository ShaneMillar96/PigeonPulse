import { useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { PigeonResponse } from '../interfaces/pigeon';

export const useFetchAllPigeons = () => {
    const fetchAllPigeons = useCallback(async () => {
        try {
            const response = await axiosInstance.get<PigeonResponse>('/pigeon', {
                params: { pageSize: 1000, pageNumber: 1 },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching all pigeons:', error);
            return [];
        }
    }, []);

    return { fetchAllPigeons };
};