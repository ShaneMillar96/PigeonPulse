import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { usePigeons } from '../hooks/usePigeons';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify'; // For error notifications
import { motion, AnimatePresence } from 'framer-motion';
import {Pigeon} from "../interfaces/race.ts"; // For animations

export const RaceBasket: React.FC = () => {
    const { raceId } = useParams<{ raceId: string }>();
    const { fetchBasketsByRaceId, addPigeonToBasket, removePigeonFromBasket, updateRaceStatus } = useRaces();
    const { fetchAllPigeons, loading } = usePigeons();
    const navigate = useNavigate();

    const [baskets, setBaskets] = useState<any[]>([]);
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);

    const [selectedPigeonId, setSelectedPigeonId] = useState<number | null>(null);
    const [canCompleteBasket, setCanCompleteBasket] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false); 

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

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, pigeonId: number) => {
        event.dataTransfer.setData('pigeonId', pigeonId.toString());
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(false);
        const pigeonId = event.dataTransfer.getData('pigeonId');
        if (!pigeonId || !raceId) return;

        try {
            await addPigeonToBasket(Number(raceId), Number(pigeonId));
            const updatedBaskets = await fetchBasketsByRaceId(Number(raceId));
            setBaskets(updatedBaskets);
            setCanCompleteBasket(updatedBaskets.length > 0);
            toast.success('Pigeon added to basket!');
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
            toast.success('Pigeon removed from basket.');
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

                {/* Pigeon Selection - Horizontal Scrollable Cards */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-semibold mb-3">Drag a Pigeon to Add</h2>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading pigeons...</p>
                    ) : (
                        <div className="flex overflow-x-auto space-x-4 p-3 bg-gray-200 rounded-md">
                            {availablePigeons.length === 0 ? (
                                <p className="text-gray-600">No available pigeons.</p>
                            ) : (
                                availablePigeons.map((pigeon) => (
                                    <motion.div
                                        key={pigeon.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, pigeon.id)}
                                        className="bg-white shadow-md rounded-md p-4 flex flex-col items-center cursor-grab w-32"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img
                                            src="/placeholder-pigeon.png"
                                            alt={`Pigeon ${pigeon.name}`}
                                            className="w-16 h-16 rounded-full mb-2"
                                        />
                                        <p className="text-sm font-medium">{pigeon.name}</p>
                                        <p className="text-xs text-gray-500">Ring: {pigeon.ringNumber}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Basketed Pigeons - Droppable Area */}
                <div
                    className={`bg-white p-6 rounded-lg shadow-md min-h-32 flex flex-wrap gap-4 justify-center items-center transition-colors ${
                        isDraggingOver ? 'border-4 border-green-300 bg-green-50' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="region"
                    aria-label="Basketed pigeons drop area"
                >
                    <h2 className="text-lg font-semibold w-full text-center">Pigeons in the Race</h2>
                    {baskets.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">No pigeons basketed yet.</p>
                    ) : (
                        <AnimatePresence>
                            {baskets.map((basket) => (
                                <motion.div
                                    key={basket.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center relative w-32"
                                >
                                    <img
                                        src="/placeholder-pigeon.png"
                                        alt={`Pigeon ${basket.pigeonName}`}
                                        className="w-16 h-16 rounded-full mb-2"
                                    />
                                    <p className="text-sm font-medium">{basket.pigeonName}</p>
                                    <p className="text-xs text-gray-500">Ring: {basket.ringNumber}</p>
                                    <button
                                        onClick={() => handleRemovePigeon(basket.id)}
                                        className="absolute top-1 right-1 text-red-500 hover:text-red-700 transition"
                                        aria-label={`Remove ${basket.pigeonName} from basket`}
                                    >
                                        <FaTrash />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Complete Basket Button */}
                {canCompleteBasket && (
                    <div className="text-center mt-6">
                        <motion.button
                            onClick={handleCompleteBasket}
                            className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaCheckCircle className="mr-2" />
                            Complete Basket
                        </motion.button>
                    </div>
                )}

                {/* Back Button */}
                <div className="text-center mt-6">
                    <motion.button
                        onClick={() => navigate('/races')}
                        className="bg-gray-500 text-white px-6 py-3 rounded shadow hover:bg-gray-600 transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back to Races
                    </motion.button>
                </div>
            </main>
            <Footer />
        </div>
    );
};