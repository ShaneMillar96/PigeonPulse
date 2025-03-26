import React, { useEffect } from 'react';
import { useRaces } from '../hooks/useRaces';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaTrophy, FaShoppingBasket, FaTachometerAlt, FaFlag } from 'react-icons/fa';

export const Races: React.FC = () => {
    const { races, loading, fetchRaces, deleteRace } = useRaces();

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Race Management</h1>
                {loading ? (
                    <p className="text-center text-gray-600">Loading races...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add Race Button */}
                        <Link
                            to="/add-race"
                            className="bg-white flex flex-col justify-center items-center h-40 border-2 border-dashed rounded-lg shadow-sm hover:border-gray-400 transition"
                        >
                            <FaPlus size={40} className="text-gray-500" />
                            <p className="text-gray-500">Add New Race</p>
                        </Link>

                        {/* Display Races */}
                        {races.map((race) => (
                            <div key={race.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold">{race.name}</h2>
                                    <p className="text-gray-600">Date: {new Date(race.date).toLocaleDateString()}</p>
                                    <p className="text-gray-600">Distance: {race.distance} km</p>

                                    {/* Status Badge */}
                                    <div className="mt-2">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                race.raceStatus.name === 'New'
                                                    ? 'bg-gray-200 text-gray-800'
                                                    : race.raceStatus.name === 'Basketed'
                                                        ? 'bg-yellow-200 text-yellow-800'
                                                        : 'bg-green-200 text-green-800'
                                            }`}
                                        >
                                            {race.raceStatus.name}
                                            {race.raceStatus.name === 'New' && <FaFlag className="ml-2" />}
                                            {race.raceStatus.name === 'Basketed' && <FaShoppingBasket className="ml-2" />}
                                            {race.raceStatus.name === 'Finished' && <FaTrophy className="ml-2" />}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 mt-4">
                                    <Link to={`/edit-race/${race.id}`} className="text-blue-500 hover:text-blue-700">
                                        <FaEdit size={20} />
                                    </Link>
                                    <button onClick={() => deleteRace(race.id)} className="text-red-500 hover:text-red-700">
                                        <FaTrash size={20} />
                                    </button>

                                    {race.raceStatus.name === 'New' && (
                                        <Link to={`/race/${race.id}/basket`} className="text-yellow-500 hover:text-yellow-700">
                                            <FaShoppingBasket size={20} />
                                        </Link>
                                    )}
                                    {race.raceStatus.name === 'Basketed' && (
                                        <Link to={`/race/${race.id}/results`} className="text-green-500 hover:text-green-700">
                                            <FaTachometerAlt size={20} />
                                        </Link>
                                    )}
                                    {race.raceStatus.name === 'Finished' && (
                                        <Link to={`/race/${race.id}/leaderboard`} className="text-purple-500 hover:text-purple-700">
                                            <FaTrophy size={20} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};