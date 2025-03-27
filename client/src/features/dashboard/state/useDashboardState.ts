import { useState } from 'react';

export const useDashboardState = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    return {
        dashboardData,
        setDashboardData,
        loading,
        setLoading,
        error,
        setError,
        hasFetched,
        setHasFetched,
    };
};