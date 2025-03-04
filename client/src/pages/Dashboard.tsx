import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaTrophy, FaDove, FaChartLine } from 'react-icons/fa';

export const Dashboard: React.FC = () => {
    const { dashboardData, fetchDashboard, loading, error } = useDashboard();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Dashboard</h1>

                {loading && <p className="text-center text-gray-600">Loading dashboard data...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {dashboardData && !loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Best Pigeon */}
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                            <FaDove className="text-blue-500 text-4xl mr-4" />
                            <div>
                                <h2 className="text-lg font-semibold">🏅 Best Pigeon</h2>
                                <p className="text-gray-600">{dashboardData.bestPigeon.name} ({dashboardData.bestPigeon.ringNumber})</p>
                                <p className="text-sm text-gray-500">Fastest Time: {dashboardData.bestPigeon.fastestTime}</p>
                            </div>
                        </div>

                        {/* Best Race */}
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                            <FaTrophy className="text-yellow-500 text-4xl mr-4" />
                            <div>
                                <h2 className="text-lg font-semibold">🏆 Best Race</h2>
                                <p className="text-gray-600">{dashboardData.bestRace.name}</p>
                                <p className="text-sm text-gray-500">Most Competitive Time Gap: {dashboardData.bestRace.timeGap}</p>
                            </div>
                        </div>

                        {/* Summary Statistics */}
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                            <FaChartLine className="text-green-500 text-4xl mr-4" />
                            <div>
                                <h2 className="text-lg font-semibold">📊 Summary</h2>
                                <p className="text-gray-600">Total Pigeons: {dashboardData.totalPigeons}</p>
                                <p className="text-gray-600">Total Races: {dashboardData.totalRaces}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};
