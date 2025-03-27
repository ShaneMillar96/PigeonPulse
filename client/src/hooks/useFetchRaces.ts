import { useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Race } from '../interfaces/race';
import { toast } from 'react-toastify';

// Define the expected leaderboard response structure
interface LeaderboardResponse {
    raceName: string;
    results: Array<{
        id: number;
        pigeonId: number;
        ringNumber: string;
        timeRecorded: string;
    }>;
}

export const useFetchRaces = ({ setRaces, setLoading, setError }) => {
    const fetchRaces = useCallback(async () => {
        setLoading(true);
        setError(null);
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
            const response = await axiosInstance.get<LeaderboardResponse>(`/race/${raceId}/leaderboard`);
            return response.data; // Return the full object { raceName, results }
        } catch (err: any) {
            const errorMessage = 'Failed to fetch leaderboard';
            setError(errorMessage);
            toast.error(errorMessage);
            return { raceName: 'Error', results: [] }; // Fallback structure
        }
    }, [setError]);

    return { fetchRaces, getRaceById, getRaceLeaderboard };
};