import React, { useEffect, useCallback, useRef } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSitemap } from 'react-icons/fa';
import PlaceHolder from '../../public/placeholder-pigeon.png';

export const Pigeons: React.FC = () => {
    const {
        pigeons,
        loading,
        hasMore,
        searchQuery,
        setSearchQuery,
        fetchPaginatedPigeons,
        deletePigeon,
        searchPigeons,
    } = usePigeons();

    const observer = useRef<IntersectionObserver | null>(null);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        searchPigeons(event.target.value);
    };

    const lastPigeonRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading || !hasMore) return;
            if (observer.current) observer.current.disconnect?.();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    fetchPaginatedPigeons();
                }
            });
            if (node) observer.current.observe?.(node);
        },
        [loading, hasMore, fetchPaginatedPigeons]
    );

    useEffect(() => {
        fetchPaginatedPigeons();
    }, [fetchPaginatedPigeons]);


    const handleDelete = async (pigeonId: number) => {
        if (window.confirm('Are you sure you want to delete this pigeon?')) {
            await deletePigeon(pigeonId);
            searchPigeons(searchQuery);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Pigeons</h1>

                <div className="relative mb-6 max-w-lg mx-auto">
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        placeholder="Search by ring number..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        to="/add-pigeon"
                        className="bg-white flex flex-col justify-center items-center h-40 border-2 border-dashed rounded-lg shadow-sm hover:border-gray-400 transition"
                    >
                        <FaPlus size={40} className="text-gray-500" />
                        <p className="text-gray-500">Add New Pigeon</p>
                    </Link>

                    {pigeons.map((pigeon, index) => (
                        <div
                            key={pigeon.id}
                            ref={index === pigeons.length - 1 ? lastPigeonRef : null}
                            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                        >
                            <div className="w-24 h-24 mb-4">
                                <img
                                    src={pigeon.imageUrl || (PlaceHolder as string)}
                                    alt={pigeon.ringNumber}
                                    className="rounded-full border border-gray-300 object-cover w-full h-full"
                                />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">{pigeon.ringNumber}</h2>
                            <p className="text-gray-600">
                                Ring Number: <span className="font-medium">{pigeon.ringNumber}</span>
                            </p>

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
                                {pigeon.fatherId && pigeon.motherId && (
                                    <Link
                                        to={`/pedigree/${pigeon.id}`}
                                        className="text-green-600 hover:text-green-800"
                                        title="View Pedigree"
                                    >
                                        <FaSitemap size={20} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center my-4">
                        <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};