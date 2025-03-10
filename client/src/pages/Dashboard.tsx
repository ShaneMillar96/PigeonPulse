import React, { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaTrophy, FaDove, FaChartLine, FaClock, FaPlane, FaFlagCheckered } from 'react-icons/fa';
import StatCard from '../components/common/StatCard';

export const Dashboard: React.FC = () => {
    const { dashboardData, fetchDashboard, loading, error } = useDashboard();

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Dashboard</h1>

                {loading && <p className="text-center text-gray-600">Loading dashboard data...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {dashboardData && (
                    <>
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <StatCard
                                icon={<FaDove/>}
                                title="Best Pigeon"
                                text={dashboardData.bestPigeon
                                    ? `${dashboardData.bestPigeon.name} (${dashboardData.bestPigeon.ringNumber})`
                                    : 'N/A'}
                            />
                            <StatCard
                                icon={<FaTrophy/>}
                                title="Best Race"
                                text={dashboardData.bestRace?.name || 'N/A'}
                            />
                            <StatCard
                                icon={<FaChartLine/>}
                                title="Overview"
                                text={`Pigeons: ${dashboardData.totalPigeons ?? 0}, Races: ${dashboardData.totalRaces ?? 0}`}
                            />
                            <StatCard
                                icon={<FaFlagCheckered/>}
                                title="Best Long-Range Pigeon"
                                text={dashboardData.bestLongRangePigeon
                                    ? `${dashboardData.bestLongRangePigeon.name} (${dashboardData.bestLongRangePigeon.ringNumber}) - ${dashboardData.bestLongRangePigeon.raceDistance} km`
                                    : 'N/A'}
                            />
                            <StatCard
                                icon={<FaPlane/>}
                                title="Most Active Pigeon"
                                text={dashboardData.mostActivePigeon
                                    ? `${dashboardData.mostActivePigeon.name} (${dashboardData.mostActivePigeon.ringNumber}) - ${dashboardData.mostActivePigeon.raceCount} Races`
                                    : 'N/A'}
                            />
                        </div>

                        {/* Upcoming Races */}
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <FaClock className="text-blue-500 text-2xl mr-2"/>
                                Upcoming Races
                            </h2>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2">Race Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dashboardData.upcomingRaces?.map((race, index) => (
                                    <tr key={index} className="border border-gray-300">
                                        <td className="px-4 py-2">{race.name}</td>
                                        <td className="px-4 py-2">{new Date(race.date).toLocaleDateString()}</td>
                                    </tr>
                                )) || <tr><td colSpan={2} className="text-center py-2">No upcoming races</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
            <Footer/>
        </div>
    );
};

export default Dashboard;