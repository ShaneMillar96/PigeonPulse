import React, { useEffect } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; 

export const Pigeons: React.FC = () => {
    const { pigeons, fetchPigeons, loading, error } = usePigeons();

    useEffect(() => {
        fetchPigeons();
    }, [fetchPigeons]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Pigeons</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Add Pigeon Card */}
                    <Link
                        to="/add-pigeon"
                        className="bg-gray-800 text-white p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors flex items-center justify-center cursor-pointer h-48"
                    >
                        <FaPlus className="text-4xl" />
                        <span className="ml-2">Add Pigeon</span>
                    </Link>

                    {/* Pigeon Cards */}
                    {pigeons.map((pigeon) => (
                        <div
                            key={pigeon.id}
                            className="bg-gray-800 text-white p-4 rounded-lg shadow-md h-48 flex items-center justify-center"
                        >
                            <p className="text-center">
                                {pigeon.name} - {pigeon.ringNumber}
                            </p>
                        </div>
                    ))}
                </div>
                {loading && <p className="text-center mt-4">Loading...</p>}
            </main>
            <Footer />
        </div>
    );
};