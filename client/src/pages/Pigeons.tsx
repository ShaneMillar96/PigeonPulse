import React, { useEffect } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export const Pigeons: React.FC = () => {
    const { pigeons, fetchPigeons, deletePigeon, loading, error } = usePigeons();

    useEffect(() => {
        fetchPigeons();
    }, [fetchPigeons]);

    const handleDelete = async (pigeonId: number) => {
        if (window.confirm('Are you sure you want to delete this pigeon?')) {
            await deletePigeon(pigeonId);
            fetchPigeons();
        }
    };

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
                        className="bg-gray-200 flex justify-center items-center h-32 border rounded shadow hover:bg-gray-300 transition"
                    >
                        <FaPlus size={32} />
                    </Link>

                    {/* Display Pigeons */}
                    {pigeons.map((pigeon) => (
                        <div key={pigeon.id} className="border p-4 rounded shadow bg-white flex justify-between">
                            <div>
                                <h2 className="text-xl font-bold">{pigeon.name}</h2>
                                <p className="text-gray-600">Ring Number: {pigeon.ringNumber}</p>
                                <p className="text-gray-600">Color: {pigeon.color}</p>
                                <p className="text-gray-600">Strain: {pigeon.strain}</p>
                            </div>
                            <div className="flex space-x-2">
                                <Link to={`/edit-pigeon/${pigeon.id}`} className="text-blue-500 hover:text-blue-700">
                                    <FaEdit />
                                </Link>
                                <button
                                    onClick={() => handleDelete(pigeon.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};
