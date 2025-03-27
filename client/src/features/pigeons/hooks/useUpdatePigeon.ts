import { useCallback } from 'react';
import axiosInstance from '../../../lib/api/axiosInstance';
import { Pigeon, PigeonRequest } from '../';
import { toast } from 'react-toastify';

// Accept state as an argument
export const useUpdatePigeon = ({ setPigeons, setLoading, setError }) => {
    const updatePigeon = useCallback(
        async (pigeonId: number, data: PigeonRequest) => {
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
        },
        [setPigeons, setLoading, setError] // Add dependencies
    );

    return { updatePigeon };
};