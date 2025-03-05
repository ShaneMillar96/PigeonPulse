import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Pigeon, PigeonRequest } from '../interfaces/pigeon';
import { toast } from 'react-toastify';

export const usePigeons = () => {
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);


    // Fetch pigeons (supports pagination)
    const fetchPigeons = useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get<Pigeon[]>(`/pigeon`, {
                params: { pageSize: 10, pageNumber, searchQuery },
            });

            setPigeons(prev => [...prev, ...response.data.data]);
            setHasMore(response.data.totalCount > pigeons.length + response.data.data.length);
            setPageNumber(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching pigeons:', error);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, hasMore, loading, searchQuery]);

    // fetch list of all pigeons
    const fetchAllPigeons = async () => {
        try {
            const response = await axiosInstance.get(`/pigeon`, {
                params: { pageSize: 1000, pageNumber: 1 }, // Large limit to fetch all pigeons
            });
            return response.data.data; // Return only pigeon list
        } catch (error) {
            console.error('Error fetching all pigeons:', error);
            return [];
        }
    };



    // Search pigeons by ring number
    const searchPigeons = async (query: string) => {
        setSearchQuery(query);
        setPageNumber(1);
        setLoading(true);
        setHasMore(false); // Reset hasMore to prevent unnecessary additional fetching
        setPigeons([]); // Clear the pigeon list before new search

        try {
            const response = await axiosInstance.get(`/pigeon`, {
                params: { pageSize: 10, pageNumber: 1, searchQuery: query },
            });

            setPigeons(response.data.data);
            setHasMore(response.data.totalCount > response.data.data.length);
        } catch (error) {
            console.error('Error searching pigeons:', error);
        } finally {
            setLoading(false);
        }
    };


    // Delete pigeon
    const deletePigeon = async (pigeonId: number) => {
        try {
            await axiosInstance.delete(`/pigeon/${pigeonId}`);
            setPigeons(prev => prev.filter(p => p.id !== pigeonId));
        } catch (error) {
            console.error('Error deleting pigeon:', error);
        }
    };

    const createPigeon = async (data: PigeonRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<Pigeon>('/pigeon', data);
            setPigeons((prev) => [...prev, response.data]);
            setError(null);
            toast.success('Pigeon created successfully!');
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create pigeon';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { pigeons, searchPigeons, loading, deletePigeon, hasMore, error, fetchPigeons, fetchAllPigeons, createPigeon };
};