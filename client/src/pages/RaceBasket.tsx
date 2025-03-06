import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { usePigeons } from '../hooks/usePigeons';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Pigeon } from '../interfaces/race';

export const RaceBasket: React.FC = () => {
    const { raceId } = useParams<{ raceId: string }>();
    const { fetchBasketsByRaceId, addPigeonToBasket, removePigeonFromBasket, updateRaceStatus } = useRaces();
    const { fetchAllPigeons, loading } = usePigeons();
    const navigate = useNavigate();

    const [baskets, setBaskets] = useState<any[]>([]);
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [canCompleteBasket, setCanCompleteBasket] = useState(false);

    useEffect(() => {
        fetchAllPigeons().then(setPigeons);
        if (raceId) {
            fetchBasketsByRaceId(Number(raceId)).then((data) => {
                setBaskets(data);
                setCanCompleteBasket(data.length > 0);
            });
        }
    }, [raceId]);
    
    const availablePigeons = pigeons.filter(
        (pigeon) => !baskets.some((basket) => basket.pigeonId === pigeon.id)
    );

    const handleAddPigeon = async (pigeonId: number) => {
        if (!raceId) return;
        try {
            await addPigeonToBasket(Number(raceId), pigeonId);
            const updatedBaskets = await fetchBasketsByRaceId(Number(raceId));
            setBaskets(updatedBaskets);
            setCanCompleteBasket(updatedBaskets.length > 0);
        } catch (err) {
            toast.error('Failed to add pigeon to basket.');
        }
    };

    const handleRemovePigeon = async (basketId: number) => {
        try {
            await removePigeonFromBasket(basketId);
            const updatedBaskets = await fetchBasketsByRaceId(Number(raceId));
            setBaskets(updatedBaskets);
            setCanCompleteBasket(updatedBaskets.length > 0);
        } catch (err) {
            toast.error('Failed to remove pigeon.');
        }
    };

    const handleCompleteBasket = async () => {
        if (raceId) {
            try {
                await updateRaceStatus(Number(raceId), '2');
                navigate('/races');
                toast.success('Basket completed successfully!');
            } catch (err) {
                toast.error('Failed to complete basket.');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Race Basket</h1>

                {/* Dual-Pane Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Available Pigeons Pane */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4 text-center">Available Pigeons</h2>
                        {loading ? (
                            <p className="text-center text-gray-500">Loading pigeons...</p>
                        ) : availablePigeons.length === 0 ? (
                            <p className="text-gray-600 text-center">No available pigeons.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <AnimatePresence>
                                    {availablePigeons.map((pigeon) => (
                                        <motion.div
                                            key={pigeon.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center relative"
                                        >
                                            <img
                                                src="/placeholder-pigeon.png"
                                                alt={`Pigeon ${pigeon.name}`}
                                                className="w-16 h-16 rounded-full mb-2"
                                            />
                                            <p className="text-sm font-medium text-gray-800">{pigeon.name}</p>
                                            <p className="text-xs text-gray-500">Ring: {pigeon.ringNumber}</p>
                                            <motion.button
                                                onClick={() => handleAddPigeon(pigeon.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mt-2 flex items-center bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition"
                                                aria-label={`Add ${pigeon.name} to basket`}
                                            >
                                                <FaPlus className="mr-1" />
                                                Add
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Basketed Pigeons Pane */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4 text-center">Pigeons in Basket</h2>
                        {baskets.length === 0 ? (
                            <p className="text-gray-600 text-center py-4">No pigeons in basket yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <AnimatePresence>
                                    {baskets.map((basket) => (
                                        <motion.div
                                            key={basket.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center relative"
                                        >
                                            <img
                                                src="/placeholder-pigeon.png"
                                                alt={`Pigeon ${basket.pigeonName}`}
                                                className="w-16 h-16 rounded-full mb-2"
                                            />
                                            <p className="text-sm font-medium text-gray-800">{basket.pigeonName}</p>
                                            <p className="text-xs text-gray-500">Ring: {basket.ringNumber}</p>
                                            <motion.button
                                                onClick={() => handleRemovePigeon(basket.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mt-2 flex items-center bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                                                aria-label={`Remove ${basket.pigeonName} from basket`}
                                            >
                                                <FaTrash className="mr-1" />
                                                Remove
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                    {canCompleteBasket && (
                        <motion.button
                            onClick={handleCompleteBasket}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition"
                        >
                            <FaCheckCircle className="mr-2" />
                            Complete Basket
                        </motion.button>
                    )}
                    <motion.button
                        onClick={() => navigate('/races')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center bg-gray-500 text-white px-6 py-3 rounded shadow hover:bg-gray-600 transition"
                    >
                        Back to Races
                    </motion.button>
                </div>
            </main>
            <Footer />
        </div>
    );
};