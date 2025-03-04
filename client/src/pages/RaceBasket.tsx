import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { usePigeons } from '../hooks/usePigeons';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaTrash, FaPlusCircle, FaCheckCircle } from 'react-icons/fa';

export const RaceBasket: React.FC = () => {
    const { raceId } = useParams<{ raceId: string }>();
    const { fetchBasketsByRaceId, addPigeonToBasket, removePigeonFromBasket, updateRaceStatus } = useRaces();
    const { pigeons, fetchPigeons } = usePigeons();
    const navigate = useNavigate();

    const [baskets, setBaskets] = useState<any[]>([]);
    const [selectedPigeonId, setSelectedPigeonId] = useState<number | null>(null);
    const [canCompleteBasket, setCanCompleteBasket] = useState(false);

    useEffect(() => {
        fetchPigeons();
        if (raceId) {
            fetchBasketsByRaceId(Number(raceId)).then((data) => {
                setBaskets(data);
                setCanCompleteBasket(data.length > 0);
            });
        }
    }, [raceId]);

    // Get only pigeons that have NOT been basketed yet
    const availablePigeons = pigeons.filter(
        (pigeon) => !baskets.some((basket) => basket.pigeonId === pigeon.id)
    );

    const handleAddPigeon = async () => {
        if (!selectedPigeonId || !raceId) return;
        await addPigeonToBasket(Number(raceId), selectedPigeonId);
        fetchBasketsByRaceId(Number(raceId)).then((data) => {
            setBaskets(data);
            setCanCompleteBasket(data.length > 0);
        });
    };

    const handleRemovePigeon = async (basketId: number) => {
        await removePigeonFromBasket(basketId);
        fetchBasketsByRaceId(Number(raceId)).then((data) => {
            setBaskets(data);
            setCanCompleteBasket(data.length > 0);
        });
    };

    const handleCompleteBasket = async () => {
        if (raceId) {
            await updateRaceStatus(Number(raceId), '2');
            navigate('/races');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Race Basket</h1>

                {/* Pigeon Selection */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-semibold mb-3">Select a Pigeon to Add</h2>
                    <div className="flex items-center space-x-4">
                        <select
                            className="border p-3 w-full rounded-md"
                            onChange={(e) => setSelectedPigeonId(Number(e.target.value))}
                        >
                            <option value="">Select a Pigeon</option>
                            {availablePigeons.map((pigeon) => (
                                <option key={pigeon.id} value={pigeon.id}>
                                    {pigeon.name} (Ring: {pigeon.ringNumber})
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddPigeon}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                            disabled={!selectedPigeonId}
                        >
                            <FaPlusCircle className="mr-2" />
                            Add
                        </button>
                    </div>
                </div>

                {/* Basketed Pigeons */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-3">Pigeons in the Race</h2>
                    {baskets.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">No pigeons basketed yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {baskets.map((basket) => (
                                <div key={basket.id} className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-medium">{basket.pigeonName}</p>
                                        <p className="text-gray-600 text-sm">Ring: {basket.ringNumber}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemovePigeon(basket.id)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Complete Basket Button */}
                {canCompleteBasket && (
                    <div className="text-center mt-6">
                        <button
                            onClick={handleCompleteBasket}
                            className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition"
                        >
                            <FaCheckCircle className="mr-2" />
                            Complete Basket
                        </button>
                    </div>
                )}

                {/* Back Button */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/races')}
                        className="bg-gray-500 text-white px-6 py-3 rounded shadow hover:bg-gray-600 transition"
                    >
                        Back to Races
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};
