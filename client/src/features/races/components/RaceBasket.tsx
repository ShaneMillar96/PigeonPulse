import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { usePigeons, Pigeon } from '../';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../../../components';
import { FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';


export const RaceBasket: React.FC = () => {
    const { raceId } = useParams<{ raceId: string }>();
    const { fetchBasketsByRaceId, addPigeonToBasket, removePigeonFromBasket, updateRaceStatus, loading: racesLoading } = useRaces();
    const { fetchAllPigeons, loading: pigeonsLoading } = usePigeons();
    const navigate = useNavigate();

    const [baskets, setBaskets] = useState<any[]>([]);
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [activeTab, setActiveTab] = useState<'available' | 'basketed'>('available');

    useEffect(() => {
        // Only run once on mount or when raceId changes
        Promise.all([
            fetchAllPigeons().then(setPigeons),
            raceId ? fetchBasketsByRaceId(Number(raceId)).then(setBaskets) : Promise.resolve(),
        ]).catch((err) => {
            console.error('Error in initial fetch:', err);
            toast.error('Failed to load initial data');
        });
    }, [raceId]); // Only depend on raceId

    const availablePigeons = pigeons.filter((pigeon) => !baskets.some((basket) => basket.pigeonId === pigeon.id));

    const handleAddPigeon = async (pigeonId: number) => {
        if (!raceId) return;
        try {
            await addPigeonToBasket(Number(raceId), pigeonId);
            const updatedBaskets = await fetchBasketsByRaceId(Number(raceId));
            setBaskets(updatedBaskets);
        } catch (err) {
            console.error('Error adding pigeon:', err);
        }
    };

    const handleRemovePigeon = async (basketId: number) => {
        try {
            await removePigeonFromBasket(basketId);
            const updatedBaskets = await fetchBasketsByRaceId(Number(raceId));
            setBaskets(updatedBaskets);
        } catch (err) {
            console.error('Error removing pigeon:', err);
        }
    };

    const handleCompleteBasket = async () => {
        if (raceId) {
            try {
                await updateRaceStatus(Number(raceId), '2');
                navigate('/races');
                toast.success('Basket completed successfully!');
            } catch (err) {
                console.error('Error completing basket:', err);
                toast.error('Failed to complete basket');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Manage Race Basket</h1>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-4 py-2 font-semibold rounded-t-lg ${activeTab === 'available' ? 'bg-white text-blue-600 shadow-md' : 'bg-gray-200 text-gray-600'}`}
                    >
                        Available Pigeons ({availablePigeons.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('basketed')}
                        className={`px-4 py-2 font-semibold rounded-t-lg ${activeTab === 'basketed' ? 'bg-white text-blue-600 shadow-md' : 'bg-gray-200 text-gray-600'}`}
                    >
                        Basketed Pigeons ({baskets.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-4 max-h-[60vh] overflow-y-auto">
                    {pigeonsLoading || racesLoading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : activeTab === 'available' ? (
                        availablePigeons.length === 0 ? (
                            <p className="text-center text-gray-600">No available pigeons.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                <AnimatePresence>
                                    {availablePigeons.map((pigeon) => (
                                        <motion.div
                                            key={pigeon.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src="/placeholder-pigeon.png"
                                                    alt={`Pigeon ${pigeon.ringNumber}`}
                                                    className="w-10 h-10 rounded-full mr-3"
                                                />
                                                <p className="text-sm text-gray-800">Ring: {pigeon.ringNumber}</p>
                                            </div>
                                            <motion.button
                                                onClick={() => handleAddPigeon(pigeon.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-blue-500 text-white px-3 py-1 rounded flex items-center text-sm"
                                            >
                                                <FaPlus className="mr-1" /> Add
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )
                    ) : baskets.length === 0 ? (
                        <p className="text-center text-gray-600">No pigeons in basket yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            <AnimatePresence>
                                {baskets.map((basket) => (
                                    <motion.div
                                        key={basket.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                                    >
                                        <div className="flex items-center">
                                            <img
                                                src="/placeholder-pigeon.png"
                                                alt={`Pigeon ${basket.ringNumber}`}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{basket.pigeonName}</p>
                                                <p className="text-xs text-gray-500">Ring: {basket.ringNumber}</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => handleRemovePigeon(basket.id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-red-500 text-white px-3 py-1 rounded flex items-center text-sm"
                                        >
                                            <FaTrash className="mr-1" /> Remove
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Sticky Action Bar */}
                <motion.div
                    className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-center gap-4 border-t"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                >
                    {baskets.length > 0 && (
                        <motion.button
                            onClick={handleCompleteBasket}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                        >
                            <FaCheckCircle className="mr-2" /> Complete Basket
                        </motion.button>
                    )}
                    <motion.button
                        onClick={() => navigate('/races')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Back to Races
                    </motion.button>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};