import { useCallback } from 'react';
import axiosInstance from '../../../lib/api/axiosInstance';

// Accept state as an argument
export const useDeletePigeon = ({ setPigeons }) => {
    const deletePigeon = useCallback(
        async (pigeonId: number) => {
            try {
                await axiosInstance.delete(`/pigeon/${pigeonId}`);
                setPigeons((prev) => prev.filter((p) => p.id !== pigeonId));
            } catch (error) {
                console.error('Error deleting pigeon:', error);
            }
        },
        [setPigeons] // Add dependency
    );

    return { deletePigeon };
};