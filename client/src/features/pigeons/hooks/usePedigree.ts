import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/api/axiosInstance';
import { PedigreeNode } from '@/features/pairing';

interface UsePedigreeResult {
    pedigree: PedigreeNode | null;
    loading: boolean;
    error: string | null;
}

export const usePedigree = (pigeonId: string | undefined): UsePedigreeResult => {
    const [pedigree, setPedigree] = useState<PedigreeNode | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPedigree = async () => {
            try {
                if (!pigeonId) {
                    throw new Error('Pigeon ID is required');
                }
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get(`/pigeon/${pigeonId}/pedigree?generations=4`);
                setPedigree(response.data);
            } catch (err) {
                console.error('Error fetching pedigree:', err);
                setError('Failed to load pedigree data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPedigree();
    }, [pigeonId]);

    return { pedigree, loading, error };
};