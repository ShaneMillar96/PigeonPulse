import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);  // New state to prevent multiple calls

    const fetchDashboard = useCallback(async () => {
        if (hasFetched) return;  // Prevent duplicate fetches

        setLoading(true);
        try {
            const response = await axiosInstance.get('/dashboard');
            setDashboardData(response.data);
            setHasFetched(true);  // Ensure we don't fetch again
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error('Dashboard API Error:', err);
        } finally {
            setLoading(false);
        }
    }, [hasFetched]);  // Only run if `hasFetched` is false

    return { dashboardData, fetchDashboard, loading, error };
};
