import { usePigeonState, useFetchPaginatedPigeons, useFetchAllPigeons, useGetPigeonById, useSearchPigeons, useDeletePigeon, useCreatePigeon, useUpdatePigeon } from '../';
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