import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { usePigeons } from '../hooks/usePigeons';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

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
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Manage Race Basket</h1>

                {/* Add Pigeon to Basket */}
                <select className="border p-2 w-full" onChange={(e) => setSelectedPigeonId(Number(e.target.value))}>
                    <option value="">Select a Pigeon</option>
                    {pigeons.map((pigeon) => (
                        <option key={pigeon.id} value={pigeon.id}>
                            {pigeon.name} (Ring: {pigeon.ringNumber})
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAddPigeon}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                    Add to Race
                </button>

                {/* Display Basketed Pigeons */}
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Pigeons in the Race</h2>
                    <ul className="border rounded p-4 bg-white">
                        {baskets.length === 0 ? (
                            <p className="text-gray-600">No pigeons basketed yet.</p>
                        ) : (
                            baskets.map((basket) => (
                                <li key={basket.id} className="flex justify-between p-2 border-b">
                                    <span>{basket.pigeonName} (Ring: {basket.ringNumber})</span>
                                    <button
                                        onClick={() => handleRemovePigeon(basket.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Complete Basket Button */}
                {canCompleteBasket && (
                    <button
                        onClick={handleCompleteBasket}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Complete Basket
                    </button>
                )}

                <button
                    onClick={() => navigate('/races')}
                    className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                >
                    Back to Races
                </button>
            </main>
            <Footer />
        </div>
    );
};
