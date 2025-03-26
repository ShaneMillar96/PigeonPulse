import { usePigeonState } from '../states/usePigeonState';
import { useFetchPaginatedPigeons } from './useFetchPaginatedPigeons';
import { useFetchAllPigeons } from './useFetchAllPigeons';
import { useGetPigeonById } from './useGetPigeonById';
import { useSearchPigeons } from './useSearchPigeons';
import { useDeletePigeon } from './useDeletePigeon';
import { useCreatePigeon } from './useCreatePigeon';
import { useUpdatePigeon } from './useUpdatePigeon';

export const usePigeons = () => {
    const state = usePigeonState(); // Single state instance
    const { fetchPaginatedPigeons } = useFetchPaginatedPigeons(state);
    const { fetchAllPigeons } = useFetchAllPigeons();
    const { getPigeonById } = useGetPigeonById();
    const { searchPigeons } = useSearchPigeons(state);
    const { deletePigeon } = useDeletePigeon(state);
    const { createPigeon } = useCreatePigeon(state);
    const { updatePigeon } = useUpdatePigeon(state);

    return {
        ...state,
        fetchPaginatedPigeons,
        fetchAllPigeons,
        getPigeonById,
        searchPigeons,
        deletePigeon,
        createPigeon,
        updatePigeon,
    };
};