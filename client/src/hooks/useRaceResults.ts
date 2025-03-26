import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import {RaceResult} from "../interfaces/race.ts";

export const useRaceResults = () => {
    const getRaceResults = async (raceId: number) => {
        try {
            const response = await axiosInstance.get(`/race/${raceId}/results`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (err: any) {
            toast.error('Failed to fetch race results');
            return [];
        }
    };

    const addRaceResult = async (raceId: number, raceResult: RaceResult) => {
        try {
            await axiosInstance.post(`/race/${raceId}/results`, raceResult);
            toast.success('Race result added');
        } catch (err: any) {
            toast.error('Failed to add race result');
        }
    };

    const removeRaceResult = async (raceId: number, resultId: number) => {
        try {
            await axiosInstance.delete(`/race/${raceId}/results/${resultId}`);
            toast.success('Result removed');
        } catch (err: any) {
            toast.error('Failed to remove race result');
        }
    };

    return { getRaceResults, addRaceResult, removeRaceResult };
};