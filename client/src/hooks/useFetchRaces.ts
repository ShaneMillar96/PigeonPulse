import { useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Race } from '../interfaces/race';
import { toast } from 'react-toastify';

// Accept state as an argument instead of calling useRacesState directly
export const useFetchRaces = ({ setRaces, setLoading, setError }) => {
    const fetchRaces = useCallback(async () => {
        setLoading(true);
        setError(null); // Reset error before fetching
        try {
            const response = await axiosInstance.get<Race[]>('/race');
            setRaces(response.data);
        } catch (err: any) {
            const errorMessage = 'Failed to fetch races';
            setError(errorMessage);
            toast.error(errorMessage);
            setRaces([]);
        } finally {
            setLoading(false);
        }
    }, [setRaces, setLoading, setError]);

    const getRaceById = useCallback(async (raceId: number) => {
        try {
            const response = await axiosInstance.get<Race>(`/race/${raceId}`);
            return response.data;
        } catch (err: any) {
            const errorMessage = 'Failed to fetch race';
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        }
    }, [setError]);

    const getRaceLeaderboard = useCallback(async (raceId: number) => {
        try {
            const response = await axiosInstance.get(`/race/${raceId}/leaderboard`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (err: any) {
            const errorMessage = 'Failed to fetch leaderboard';
            setError(errorMessage);
            toast.error(errorMessage);
            return [];
        }
    }, [setError]);

    return { fetchRaces, getRaceById, getRaceLeaderboard };
};