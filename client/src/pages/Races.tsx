import React, { useEffect } from 'react';
import { useRaces } from '../hooks/useRaces'; // We’ll create this hook next
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; // For "Add" icon (ensure react-icons is installed)

export const Races: React.FC = () => {
    const { races, fetchRaces, loading, error } = useRaces();

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Races</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Add Race Card */}
                    <Link
                        to="/add-race"
                        className="bg-gray-800 text-white p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors flex items-center justify-center cursor-pointer h-64"
                    >
                        <FaPlus className="text-4xl" />
                        <span className="ml-2">Add Race</span>
                    </Link>

                    {/* Race Cards */}
                    {races.map((race) => (
                        <div
                            key={race.id}
                            className="bg-gray-800 text-white p-4 rounded-lg shadow-md h-64 relative overflow-hidden"
                        >
                            <h2 className="text-lg font-semibold mb-2">{race.name}</h2>
                            <p>Date: {new Date(race.date).toLocaleDateString()}</p>
                            <p>Distance: {race.distance} km</p>
                            <p>Weather: {race.weatherConditions || 'N/A'}</p>

                            {/* Race Results (Expandable Section) */}
                            <details className="mt-4">
                                <summary className="cursor-pointer text-sm hover:text-gray-300">
                                    View Results ({race.raceresults?.length || 0})
                                </summary>
                                {race.raceresults && race.raceresults.length > 0 ? (
                                    <ul className="mt-2 text-sm">
                                        {race.raceresults.map((result) => (
                                            <li key={result.id} className="py-1">
                                                Pigeon: {result.pigeonName} - Finish Time: {new Date(result.finishTime).toLocaleTimeString()}
                                                , Speed: {result.speed || 'N/A'} km/h
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 mt-2 text-sm">No results available.</p>
                                )}
                            </details>
                        </div>
                    ))}
                </div>
                {loading && <p className="text-center mt-4">Loading...</p>}
            </main>
            <Footer />
        </div>
    );
};