import { useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useDashboardState } from '../states/useDashboardState';

export const useDashboard = () => {
    const {
        dashboardData,
        setDashboardData,
        loading,
        setLoading,
        error,
        setError,
        hasFetched,
        setHasFetched,
    } = useDashboardState();

    const fetchDashboard = useCallback(async () => {
        if (hasFetched) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get('/dashboard');
            setDashboardData(response.data);
            setHasFetched(true);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error('Dashboard API Error:', err);
        } finally {
            setLoading(false);
        }
    }, [hasFetched, setDashboardData, setLoading, setError, setHasFetched]);

    return { dashboardData, fetchDashboard, loading, error };
};