import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRaces } from '../';
import { Navbar, Footer } from '../../../components';
import { FaArrowLeft, FaMedal } from 'react-icons/fa';

// Define the shape of each leaderboard entry
interface LeaderboardEntry {
    id: number;
    pigeonId: number;
    ringNumber: string;
    timeRecorded: string;
}

export const Leaderboard: React.FC = () => {
    const { raceId } = useParams<{ raceId: string }>();
    const { getRaceLeaderboard } = useRaces();
    const navigate = useNavigate();

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [raceName, setRaceName] = useState<string>('Loading...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!raceId) {
            setError('No race ID provided');
            setRaceName('Invalid Race');
            return;
        }

        console.log("Leaderboard.tsx: Fetching leaderboard...");
        getRaceLeaderboard(Number(raceId))
            .then((data) => {
                console.log("Leaderboard API Response:", data);
                if (data && Array.isArray(data.results)) {
                    setLeaderboard(data.results);
                    setRaceName(data.raceName || 'Unknown Race');
                    setError(null);
                } else {
                    console.warn('Leaderboard.tsx: API returned invalid data format', data);
                    setLeaderboard([]);
                    setRaceName('No race data found');
                    setError('Invalid data received from server');
                }
            })
            .catch((error) => {
                console.error('Leaderboard.tsx: Error fetching leaderboard:', error);
                setLeaderboard([]);
                setRaceName('Error Loading Race');
                setError('Failed to load leaderboard');
            });
    }, [raceId, getRaceLeaderboard]); // Include getRaceLeaderboard for correctness

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate('/races')}
                        className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition flex items-center"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Races
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">
                        {raceName} Leaderboard
                    </h1>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-3">Race Results</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {leaderboard.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">
                            {error ? 'Unable to display results.' : 'No results available.'}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-3 border">Position</th>
                                    <th className="p-3 border">Pigeon (Ring Number)</th>
                                    <th className="p-3 border">Time Recorded</th>
                                </tr>
                                </thead>
                                <tbody>
                                {leaderboard.map((entry, index) => (
                                    <tr
                                        key={entry.id}
                                        className={`border ${
                                            index === 0 ? 'bg-yellow-100 font-bold' : ''
                                        }`}
                                    >
                                        <td className="p-3 border text-center">
                                            {index + 1}{' '}
                                            {index === 0 && <FaMedal className="inline text-yellow-500 ml-1" />}
                                        </td>
                                        <td className="p-3 border">{entry.ringNumber}</td>
                                        <td className="p-3 border text-center">{entry.timeRecorded}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};