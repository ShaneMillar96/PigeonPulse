import { useState } from 'react';
import { Pigeon } from '../interfaces/pigeon';

export const usePigeonState = () => {
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    return {
        pigeons, setPigeons,
        loading, setLoading,
        hasMore, setHasMore,
        pageNumber, setPageNumber,
        searchQuery, setSearchQuery,
        error, setError
    };
};