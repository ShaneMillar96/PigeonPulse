import { useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { Race } from '../interfaces/race';

export const useRaceActions = ({ setRaces, setLoading, setError }) => {
    const fetchRaces = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<Race[]>('/race');
            setRaces(response.data);
        } catch (err: any) {
            setError('Failed to fetch races');
            setRaces([]);
        } finally {
            setLoading(false);
        }
    };

    const createRace = useCallback(
        async (raceData: Partial<Race>) => {
            setLoading(true);
            setError(null);
            try {
                await axiosInstance.post('/race', raceData);
                toast.success('Race created successfully');
                await fetchRaces();
            } catch (err: any) {
                setError('Failed to create race');
                toast.error('Failed to create race');
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setError]
    );

    const updateRace = useCallback(
        async (raceId: number, raceData: Partial<Race>) => {
            setLoading(true);
            setError(null);
            try {
                await axiosInstance.put(`/race/${raceId}`, raceData);
                toast.success('Race updated successfully');
                await fetchRaces();
            } catch (err: any) {
                setError('Failed to update race');
                toast.error('Failed to update race');
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setError]
    );

    const deleteRace = useCallback(
        async (raceId: number) => {
            setLoading(true);
            setError(null);
            try {
                await axiosInstance.delete(`/race/${raceId}`);
                toast.success('Race deleted');
                await fetchRaces();
            } catch (err: any) {
                setError('Failed to delete race');
                toast.error('Failed to delete race');
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setError]
    );

    const updateRaceStatus = useCallback(
        async (raceId: number, statusId: string) => {
            setLoading(true);
            setError(null);
            try {
                await axiosInstance.put(`/race/${raceId}/status`, { statusId });
                toast.success('Race status updated');
                await fetchRaces();
            } catch (err: any) {
                setError('Failed to update race status');
                toast.error('Failed to update race status');
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setError]
    );

    return { createRace, updateRace, deleteRace, updateRaceStatus };
};