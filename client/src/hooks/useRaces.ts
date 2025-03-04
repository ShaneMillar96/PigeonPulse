import { useState, useCallback, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Race, Basket, RaceResult } from '../interfaces/race';
import { toast } from 'react-toastify';

export const useRaces = () => {
    const [races, setRaces] = useState<Race[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRaces();
    }, []);

    // Fetch all races
    const fetchRaces = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Race[]>('/race');
            setRaces(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err: any) {
            setError('Failed to fetch races');
            toast.error('Failed to fetch races');
            setRaces([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch a specific race by ID
    const getRaceById = async (raceId: number) => {
        try {
            const response = await axiosInstance.get<Race>(`/race/${raceId}`);
            return response.data;
        } catch (err: any) {
            setError('Failed to fetch race details');
            toast.error('Failed to fetch race details');
            return null;
        }
    };

    // Create a new race
    const createRace = async (raceData: Partial<Race>) => {
        try {
            await axiosInstance.post('/race', raceData);
            toast.success('Race created successfully');
            await fetchRaces();
        } catch (err: any) {
            setError('Failed to create race');
            toast.error('Failed to create race');
        }
    };

    // Update a race
    const updateRace = async (raceId: number, raceData: Partial<Race>) => {
        try {
            await axiosInstance.put(`/race/${raceId}`, raceData);
            toast.success('Race updated successfully');
            await fetchRaces();
        } catch (err: any) {
            setError('Failed to update race');
            toast.error('Failed to update race');
        }
    };

    // Delete a race
    const deleteRace = async (raceId: number) => {
        try {
            await axiosInstance.delete(`/race/${raceId}`);
            toast.success('Race deleted');
            await fetchRaces();
        } catch (err: any) {
            setError('Error deleting race');
            toast.error('Failed to delete race');
        }
    };

    // Fetch leaderboard results
    const getRaceLeaderboard = async (raceId: number) => {
        try {
            const response = await axiosInstance.get(`/race/${raceId}/leaderboard`);
            return Array.isArray(response.data.results) ? response.data : { raceName: "Unknown Race", results: [] };
        } catch (err: any) {
            console.error("Error fetching leaderboard:", err);
            toast.error("Failed to fetch leaderboard");
            return { raceName: "Error Loading Race", results: [] };
        }
    };


    // Fetch race baskets
    const fetchBasketsByRaceId = async (raceId: number) => {
        try {
            const response = await axiosInstance.get<Basket[]>(`/race/${raceId}/baskets`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (err: any) {
            setError('Failed to fetch baskets');
            toast.error('Failed to fetch baskets');
            return [];
        }
    };

    // Add a pigeon to the race basket
    const addPigeonToBasket = async (raceId: number, pigeonId: number) => {
        try {
            await axiosInstance.post(`/race/${raceId}/baskets`, { raceId, pigeonId });
            toast.success('Pigeon added to race');
            await fetchRaces();
        } catch (err: any) {
            setError('Error adding pigeon to basket');
            toast.error('Error adding pigeon');
        }
    };

    // Remove a pigeon from the race basket
    const removePigeonFromBasket = async (basketId: number) => {
        try {
            await axiosInstance.delete(`/race/baskets/${basketId}`);
            toast.success('Pigeon removed from basket');
            await fetchRaces();
        } catch (err: any) {
            setError('Error removing pigeon from basket');
            toast.error('Error removing pigeon');
        }
    };

    // Update race status (New -> Basketed -> Finished)
    const updateRaceStatus = async (raceId: number, statusId: string) => {
        try {
            console.log(raceId);
            console.log(statusId);
            await axiosInstance.put(`/race/${raceId}/status`, { raceId, statusId });
            toast.info(`Race updated to ${statusId}`);
            await fetchRaces();
        } catch (err: any) {
            setError(`Error updating race status to ${statusId}`);
            toast.error('Failed to update race');
        }
    };

    // Add race result
    const addRaceResult = async (raceId: number, raceResult: RaceResult) => {
        try {
            await axiosInstance.post(`/race/${raceId}/results`, raceResult);
            toast.success('Race result added');
            await fetchRaces();
        } catch (err: any) {
            setError('Failed to add race result');
            toast.error('Failed to add race result');
        }
    };

    // Remove race result
    const removeRaceResult = async (raceId: number, resultId: number) => {
        try {
            await axiosInstance.delete(`/race/${raceId}/results/${resultId}`, {raceId, resultId});
            toast.success('Result removed');
            await fetchRaces();
        } catch (err: any) {
            setError('Error removing Result');
            toast.error('Error removing result');
        }
    };

    // Fetch race results
    const getRaceResults = async (raceId: number) => {
        try {
            const response = await axiosInstance.get(`/race/${raceId}/results`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (err: any) {
            setError('Failed to fetch race results');
            toast.error('Failed to fetch race results');
            return [];
        }
    };

    return {
        races,
        loading,
        error,
        fetchRaces,
        getRaceById,
        createRace,
        updateRace,
        deleteRace,
        getRaceLeaderboard,
        fetchBasketsByRaceId,
        addPigeonToBasket,
        removePigeonFromBasket,
        updateRaceStatus,
        addRaceResult,
        removeRaceResult,
        getRaceResults,
    };
};
