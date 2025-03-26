import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export const useRaceBaskets = () => {
    const fetchBasketsByRaceId = async (raceId: number) => {
        try {
            const response = await axiosInstance.get(`/race/${raceId}/baskets`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (err: any) {
            toast.error('Failed to fetch baskets');
            return [];
        }
    };

    const addPigeonToBasket = async (raceId: number, pigeonId: number) => {
        try {
            await axiosInstance.post(`/race/${raceId}/baskets`, { raceId, pigeonId });
            toast.success('Pigeon added to basket');
        } catch (err: any) {
            toast.error('Failed to add pigeon to basket');
        }
    };

    const removePigeonFromBasket = async (basketId: number) => {
        try {
            await axiosInstance.delete(`/race/baskets/${basketId}`);
            toast.success('Pigeon removed from basket');
        } catch (err: any) {
            toast.error('Failed to remove pigeon from basket');
        }
    };

    return { fetchBasketsByRaceId, addPigeonToBasket, removePigeonFromBasket };
};