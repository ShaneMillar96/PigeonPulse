import { useState, useCallback, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Race, RaceResult, Basket, Pigeon } from '../interfaces/race';
import { toast } from 'react-toastify';

export const useRaces = () => {
    const [races, setRaces] = useState<Race[]>([]);
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRaces = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Race[]>('/race');
            setRaces(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch races');
            toast.error('Failed to fetch races');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPigeons = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Pigeon[]>('/pigeon'); // Updated to match backend endpoint
            setPigeons(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch pigeons');
            toast.error('Failed to fetch pigeons');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBasketsByRaceId = async (raceId: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Basket[]>(`/race/${raceId}/baskets`);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch baskets');
            toast.error('Failed to fetch baskets');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createRace = async (data: Omit<Race, 'id' | 'raceresults' | 'baskets' | 'raceStatus'>) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<Race>('/race', {
                ...data,
                date: new Date(data.date).toISOString(),
            });
            setRaces((prev) => [...prev, response.data]);
            setError(null);
            toast.success('Race created successfully!');
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create race');
            toast.error('Failed to create race');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const basketPigeon = async (basket: Pick<Basket, 'pigeonId' | 'raceId'>) => {
        setLoading(true);
        try {
            await axiosInstance.post(`/race/${basket.raceId}/basket`, { pigeonId: basket.pigeonId });
            setError(null);
            toast.success('Pigeon added to basket!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to basket pigeon');
            toast.error('Failed to basket pigeon');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removePigeonFromBasket = async (basketId: number) => {
        setLoading(true);
        try {
            await axiosInstance.delete(`/race/basket/${basketId}`);
            setError(null);
            toast.success('Pigeon removed from basket!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to remove pigeon');
            toast.error('Failed to remove pigeon');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const saveBasket = async (raceId: number) => {
        setLoading(true);
        try {
            await axiosInstance.post(`/race/${raceId}/save-basket`);
            await axiosInstance.post(`/race/${raceId}/update-status`, { statusName: 'Basketed' });
            setError(null);
            toast.success('Basket saved and race status updated!');
            await fetchRaces(); // Refresh races
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save basket');
            toast.error('Failed to save basket');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addRaceResult = async (data: Omit<RaceResult, 'id' | 'pigeonName'>) => {
        setLoading(true);
        try {
            await axiosInstance.post('/race/result', {
                ...data,
                finishTime: new Date(data.finishTime).toISOString(),
            });
            setError(null);
            toast.success('Race result added!');
            await fetchRaces(); // Refresh races
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add race result');
            toast.error('Failed to add race result');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getRaceLeaderboard = async (raceId: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<RaceResult[]>(`/race/leaderboard/${raceId}`);
            setError(null);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch leaderboard');
            toast.error('Failed to fetch leaderboard');
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRaces();
        fetchPigeons();
    }, [fetchRaces, fetchPigeons]);

    return {
        races,
        pigeons,
        loading,
        error,
        fetchRaces,
        fetchBasketsByRaceId,
        createRace,
        basketPigeon,
        removePigeonFromBasket,
        saveBasket,
        addRaceResult,
        getRaceLeaderboard,
    };
};