import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Pigeon, PigeonRequest, PigeonResponse } from '../interfaces/pigeon';
import { toast } from 'react-toastify';

export const usePigeons = () => {
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Fetch pigeons (supports pagination)
    const fetchPaginatedPigeons = useCallback(async () => {
        if (!hasMore || loading) return { data: [], totalCount: 0 };
        setLoading(true);
        try {
            const response = await axiosInstance.get<PigeonResponse>('/pigeon', {
                params: { pageSize: 10, pageNumber, searchQuery },
            });

            setPigeons((prev) => [...prev, ...response.data.data]);
            setHasMore(response.data.totalCount > pigeons.length + response.data.data.length);
            setPageNumber((prev) => prev + 1);
            return response.data;
        } catch (error) {
            console.error('Error fetching pigeons:', error);
            return { data: [], totalCount: 0 };
        } finally {
            setLoading(false);
        }
    }, [pageNumber, hasMore, loading, searchQuery, pigeons.length]);

    // Fetch list of all pigeons
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

    // Fetch a single pigeon by ID
    const getPigeonById = useCallback(async (pigeonId: number): Promise<Pigeon | null> => {
        try {
            const response = await axiosInstance.get<Pigeon>(`/pigeon/${pigeonId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pigeon by ID:', error);
            return null;
        }
    }, []);

    // Search pigeons by ring number
    const searchPigeons = useCallback(async (query: string) => {
        setSearchQuery(query);
        setPageNumber(1);
        setLoading(true);
        setHasMore(false);
        setPigeons([]);

        try {
            const response = await axiosInstance.get<PigeonResponse>('/pigeon', {
                params: { pageSize: 10, pageNumber: 1, searchQuery: query },
            });

            setPigeons(response.data.data);
            setHasMore(response.data.totalCount > response.data.data.length);
        } catch (error) {
            console.error('Error searching pigeons:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete pigeon
    const deletePigeon = useCallback(async (pigeonId: number) => {
        try {
            await axiosInstance.delete(`/pigeon/${pigeonId}`);
            setPigeons((prev) => prev.filter((p) => p.id !== pigeonId));
        } catch (error) {
            console.error('Error deleting pigeon:', error);
        }
    }, []);

    // Create a new pigeon
    const createPigeon = useCallback(async (data: PigeonRequest) => {
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
    }, []);

    // Update an existing pigeon
    const updatePigeon = useCallback(async (pigeonId: number, data: PigeonRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put<Pigeon>(`/pigeon/${pigeonId}`, data);
            setPigeons((prev) =>
                prev.map((p) => (p.id === pigeonId ? response.data : p))
            );
            setError(null);
            toast.success('Pigeon updated successfully!');
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update pigeon';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        pigeons,
        searchPigeons,
        loading,
        deletePigeon,
        hasMore,
        error,
        fetchPaginatedPigeons,
        fetchAllPigeons,
        createPigeon,
        getPigeonById,
        updatePigeon,
    };
};