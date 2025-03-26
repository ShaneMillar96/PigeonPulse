import { useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { PigeonResponse } from '../interfaces/pigeon';

// Accept state as an argument instead of using usePigeonState directly
export const useFetchPaginatedPigeons = ({
                                             pigeons,
                                             setPigeons,
                                             loading,
                                             setLoading,
                                             hasMore,
                                             setHasMore,
                                             pageNumber,
                                             setPageNumber,
                                             searchQuery,
                                         }) => {
    const fetchPaginatedPigeons = useCallback(async () => {
        if (!hasMore || loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await axiosInstance.get<PigeonResponse>('/pigeon', {
                params: { pageSize: 10, pageNumber, searchQuery },
            });
            setPigeons((prev) => {
                const newPigeons = [...prev, ...response.data.data];
                return newPigeons;
            });
            setHasMore(response.data.totalCount > pigeons.length + response.data.data.length);
            setPageNumber((prev) => prev + 1);
        } catch (error) {
            console.error('Error fetching pigeons:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error details:', error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [pageNumber, hasMore, loading, searchQuery, pigeons.length, setLoading, setPigeons, setHasMore, setPageNumber]);

    return { fetchPaginatedPigeons };
};