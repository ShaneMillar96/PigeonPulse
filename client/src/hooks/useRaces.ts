import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Race, RaceResult, Basket, RaceResultRequest} from '../interfaces/race';
import { toast } from 'react-toastify';

export const useRaces = () => {
    const [races, setRaces] = useState<Race[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchRaces = useCallback(async () => {
        if (hasFetched && error) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get<Race[]>('/race');
            setRaces(response.data);
            setError(null);
            setHasFetched(true);
        } catch (err) {
            setError('Failed to fetch races');
        } finally {
            setLoading(false);
        }
    }, [hasFetched, error]);

    const fetchBasketsByRaceId = async (raceId: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Basket[]>(`/race/${raceId}/baskets`);
            return response.data;
        } catch (err) {
            setError('Failed to fetch baskets');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const basketPigeon = async (pigeonId: number, raceId: number) => {
        setLoading(true);
        try {
            await axiosInstance.post('/race/basket', { pigeonId, raceId });
            setError(null);
            toast.success('Pigeon basketed successfully!');
        } catch (err) {
            setError('Failed to basket pigeon');
            toast.error('Failed to basket pigeon. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const addRaceResult = async (data: RaceResultRequest) => {
        setLoading(true);
        try {
            await axiosInstance.post('/race/result', data);
            setError(null);
            toast.success('Race result added successfully!');
        } catch (err) {
            setError('Failed to add race result');
            toast.error('Failed to add race result. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    return { races, loading, error, fetchRaces, fetchBasketsByRaceId, basketPigeon, addRaceResult };
};