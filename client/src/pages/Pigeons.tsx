import React, { useEffect } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import PlaceHolder from '../../public/placeholder-pigeon.png';

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
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Pigeons</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add Pigeon Button */}
                    <Link
                        to="/add-pigeon"
                        className="bg-white flex flex-col justify-center items-center h-40 border-2 border-dashed rounded-lg shadow-sm hover:border-gray-400 transition"
                    >
                        <FaPlus size={40} className="text-gray-500" />
                        <p className="text-gray-500">Add New Pigeon</p>
                    </Link>

                    {/* Display Pigeons */}
                    {pigeons.map((pigeon) => (
                        <div key={pigeon.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                            <div className="w-24 h-24 mb-4">
                                <img
                                    src={pigeon.imageUrl || PlaceHolder}
                                    alt={pigeon.name}
                                    className="rounded-full border border-gray-300 object-cover w-full h-full"
                                />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">{pigeon.name}</h2>
                            <p className="text-gray-600">Ring Number: <span className="font-medium">{pigeon.ringNumber}</span></p>

                            {/* Pigeon Details with Badges */}
                            <div className="mt-2 flex space-x-2">
                                <span className="px-3 py-1 text-sm rounded-full bg-blue-200 text-blue-800">
                                    {pigeon.color}
                                </span>
                                <span className="px-3 py-1 text-sm rounded-full bg-green-200 text-green-800">
                                    {pigeon.strain}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4 mt-4">
                                <Link to={`/edit-pigeon/${pigeon.id}`} className="text-blue-500 hover:text-blue-700">
                                    <FaEdit size={20} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(pigeon.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash size={20} />
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
