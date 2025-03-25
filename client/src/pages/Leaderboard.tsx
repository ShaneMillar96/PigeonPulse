import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRaces } from '../hooks/useRaces';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaArrowLeft, FaMedal } from 'react-icons/fa';

export const Leaderboard: React.FC = () => {
    const { raceId } = useParams<{ raceId: string }>();
    const { getRaceLeaderboard } = useRaces();
    const navigate = useNavigate();

    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [raceName, setRaceName] = useState<string>('Loading...');

    useEffect(() => {
        if (raceId) {
            console.log("Leaderboard.tsx: Fetching leaderboard...");

            getRaceLeaderboard(Number(raceId)).then((data) => {
                console.log("Leaderboard API Response:", data);

                if (data && Array.isArray(data.results)) {
                    setLeaderboard(data.results);
                    setRaceName(data.raceName || "Unknown Race");
                } else {
                    console.warn("Leaderboard.tsx: API returned invalid data format");
                    setLeaderboard([]);
                    setRaceName("No race data found");
                }
            }).catch((error) => {
                console.error("Leaderboard.tsx: Error fetching leaderboard:", error);
                setLeaderboard([]);
                setRaceName("Error Loading Race");
            });
        }
    }, [raceId]);



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
                    <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">{raceName} Leaderboard</h1>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-3">Race Results</h2>
                    {leaderboard.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">No results available.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-3 border">Position</th>
                                    <th className="p-3 border">Pigeon</th>
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
                                            {index + 1}{" "}
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
