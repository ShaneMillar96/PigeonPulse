import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Dashboard Data
    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/dashboard');
            setDashboardData(response.data);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching dashboard:", err);
            setDashboardData(null);
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    return { dashboardData, fetchDashboard, loading, error };
};
