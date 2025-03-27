import { useRacesState, useFetchRaces, useRaceActions, useRaceResults, useRaceBaskets } from '../';

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