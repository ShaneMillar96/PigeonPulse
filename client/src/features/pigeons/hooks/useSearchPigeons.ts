import { useCallback } from 'react';
import axiosInstance from '../../../lib/api/axiosInstance';
import { PigeonResponse } from '../';

// Accept state as an argument
export const useSearchPigeons = ({
                                     setSearchQuery,
                                     setPageNumber,
                                     setLoading,
                                     setHasMore,
                                     setPigeons,
                                 }) => {
    const searchPigeons = useCallback(
        async (query: string) => {
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
        },
        [setSearchQuery, setPageNumber, setLoading, setHasMore, setPigeons] // Add dependencies
    );

    return { searchPigeons };
};