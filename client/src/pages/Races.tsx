import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaTrophy, FaShoppingBasket, FaTachometerAlt, FaFlag } from 'react-icons/fa';

export const Races: React.FC = () => {
    const { races, fetchRaces, deleteRace, getRaceLeaderboard, loading, error } = useRaces();
    const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    const handleLeaderboard = async (raceId: number) => {
        setSelectedRaceId(raceId);
        const results = await getRaceLeaderboard(raceId);
        setLeaderboard(results);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Race Management</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Add Race Button */}
                    <Link
                        to="/add-race"
                        className="bg-gray-200 flex justify-center items-center h-32 border rounded shadow hover:bg-gray-300 transition"
                    >
                        <FaPlus size={32} />
                    </Link>

                    {/* Display Races */}
                    {races.map((race) => (
                        <div key={race.id} className="border p-4 rounded shadow bg-white flex flex-col">
                            <h2 className="text-xl font-bold">{race.name}</h2>
                            <p className="text-gray-600">Date: {new Date(race.date).toLocaleDateString()}</p>
                            <p className="text-gray-600 flex items-center">
                                Status: {race.raceStatus.name}
                                {race.raceStatus.name === 'New' && <FaFlag className="text-gray-500 ml-2" />}
                                {race.raceStatus.name === 'Basketed' && <FaShoppingBasket className="text-yellow-500 ml-2" />}
                                {race.raceStatus.name === 'Finished' && <FaTrophy className="text-green-500 ml-2" />}
                            </p>
                            <p className="text-gray-600">Distance: {race.distance} km</p>

                            <div className="flex space-x-2 mt-2">
                                {/* Edit and Delete Options */}
                                <Link to={`/edit-race/${race.id}`} className="text-blue-500 hover:text-blue-700">
                                    <FaEdit />
                                </Link>
                                <button
                                    onClick={() => deleteRace(race.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>

                                {/* Conditionally Render Icons Based on Status */}
                                {race.raceStatus.name === 'New' && (
                                    <Link to={`/race/${race.id}/basket`} className="text-yellow-500 hover:text-yellow-700">
                                        <FaShoppingBasket />
                                    </Link>
                                )}
                                {race.raceStatus.name === 'Basketed' && (
                                    <Link to={`/race/${race.id}/results`} className="text-green-500 hover:text-green-700">
                                        <FaTachometerAlt />
                                    </Link>
                                )}
                                {race.raceStatus.name === 'Finished' && (
                                    <button onClick={() => handleLeaderboard(race.id)} className="text-purple-500 hover:text-purple-700">
                                        <FaTrophy />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Leaderboard Modal */}
                {selectedRaceId && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
                            <button onClick={() => setSelectedRaceId(null)} className="absolute top-2 right-2">
                                ✖
                            </button>
                            <ul>
                                {leaderboard.map((entry, index) => (
                                    <li key={index} className="border-b py-2">
                                        {index + 1}. {entry.pigeonName} - {entry.timeRecorded}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};
