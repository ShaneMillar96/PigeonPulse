import { useRacesState } from '../states/useRacesState';
import { useFetchRaces } from './useFetchRaces';
import { useRaceActions } from './useRaceActions';
import { useRaceResults } from './useRaceResults';
import { useRaceBaskets } from './useRaceBaskets';

export const useRaces = () => {
    const state = useRacesState(); // Single state instance
    const { fetchRaces, getRaceById, getRaceLeaderboard } = useFetchRaces(state);
    const { createRace, updateRace, deleteRace, updateRaceStatus } = useRaceActions(state);
    const { getRaceResults, addRaceResult, removeRaceResult } = useRaceResults();
    const { fetchBasketsByRaceId, addPigeonToBasket, removePigeonFromBasket } = useRaceBaskets();

    return {
        ...state,
        fetchRaces,
        getRaceById,
        createRace,
        updateRace,
        deleteRace,
        getRaceLeaderboard,
        fetchBasketsByRaceId,
        addPigeonToBasket,
        removePigeonFromBasket,
        updateRaceStatus,
        getRaceResults,
        addRaceResult,
        removeRaceResult,
    };
};