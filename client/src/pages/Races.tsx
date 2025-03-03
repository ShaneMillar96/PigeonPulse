import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus, FaShoppingBasket, FaTrophy } from 'react-icons/fa'; // Updated icons
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';
import { Modal } from '../components/common/Modal'; // Ensure you have or create this component

export const Races: React.FC = () => {
    const { races, fetchRaces, fetchBasketsByRaceId, basketPigeon, addRaceResult, loading, error } = useRaces();
    const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
    const [baskets, setBaskets] = useState<any[]>([]); // Update to Basket[] based on your interface
    const [pigeonId, setPigeonId] = useState<number | null>(null);
    const [isBasketModalOpen, setIsBasketModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [pigeonIdForResult, setPigeonIdForResult] = useState<string>('');
    const [speed, setSpeed] = useState<string>('');
    const [finishTime, setFinishTime] = useState<string>('');

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    const fetchBaskets = async (raceId: number) => {
        setSelectedRaceId(raceId);
        const basketsData = await fetchBasketsByRaceId(raceId);
        setBaskets(basketsData);
        setIsBasketModalOpen(true); 
    };

    const handleBasketPigeon = async (raceId: number, pigeonId: number) => {
        await basketPigeon(pigeonId, raceId);
        if (!error) {
            const updatedBaskets = await fetchBasketsByRaceId(raceId);
            setBaskets(updatedBaskets);
            toast.success('Pigeon basketed successfully!');
            setIsBasketModalOpen(false); 
        }
    };

    const handleAddRaceResult = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pigeonIdForResult || !selectedRaceId) {
            toast.error('Please enter a Pigeon ID and select a race.');
            return;
        }

        await addRaceResult({
            pigeonId: parseInt(pigeonIdForResult) || 0,
            raceId: selectedRaceId,
            finishTime: new Date(finishTime || Date.now()).toISOString(),
            speed: parseFloat(speed) || null
        });

        if (!error) {
            setPigeonIdForResult('');
            setSpeed('');
            setFinishTime('');
            setIsResultModalOpen(false);
            toast.success('Race result added successfully!');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Races</h1>
                    <Link to="/add-race">
                        <Button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center">
                            <FaPlus className="mr-2" /> Add Race
                        </Button>
                    </Link>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {loading ? (
                    <p className="text-center text-gray-800">Loading...</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-200 text-gray-800">
                            <th className="p-2 border-b text-left">Name</th>
                            <th className="p-2 border-b text-left">Date</th>
                            <th className="p-2 border-b text-left">Distance (km)</th>
                            <th className="p-2 border-b text-left">Weather</th>
                            <th className="p-2 border-b text-left"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {races.map((race) => (
                            <tr key={race.id} className="hover:bg-gray-100">
                                <td className="p-2 border-b text-gray-800">{race.name}</td>
                                <td className="p-2 border-b text-gray-800">
                                    {new Date(race.date).toLocaleDateString()}
                                </td>
                                <td className="p-2 border-b text-gray-800">{race.distance}</td>
                                <td className="p-2 border-b text-gray-800">
                                    {race.weatherConditions || 'N/A'}
                                </td>
                                <td className="p-2 border-b flex space-x-2">
                                    <Button
                                        onClick={() => fetchBaskets(race.id)}
                                        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
                                        aria-label="View Baskets"
                                    >
                                        <FaShoppingBasket className="text-lg" />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedRaceId(race.id);
                                            setIsResultModalOpen(true);
                                        }}
                                        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
                                        aria-label="View/Add Results"
                                    >
                                        <FaTrophy className="text-lg" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </main>
            <Footer />

            {isBasketModalOpen && (
                <Modal
                    isOpen={isBasketModalOpen}
                    onClose={() => setIsBasketModalOpen(false)}
                    title="Basket Pigeon"
                >
                    <div className="p-4">
                        <p className="text-gray-800 mb-4">
                            Basketed Pigeons for Race ID: {selectedRaceId}
                        </p>
                        {baskets.length > 0 ? (
                            <ul className="list-disc pl-5 text-gray-800 mb-4">
                                {baskets.map((basket: any) => (
                                    <li key={basket.id} className="py-1">
                                        {basket.pigeonName} (ID: {basket.pigeonId})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mb-4">No pigeons basketed for this race.</p>
                        )}
                        <input
                            type="number"
                            placeholder="Pigeon ID to Basket"
                            value={pigeonId || ''}
                            onChange={(e) => setPigeonId(parseInt(e.target.value) || null)}
                            className="p-2 border rounded w-full mb-2 text-gray-800"
                        />
                        <Button
                            onClick={() => handleBasketPigeon(selectedRaceId!, pigeonId!)}
                            disabled={!pigeonId || loading}
                            className="mt-2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
                        >
                            {loading ? 'Basketing...' : 'Basket Pigeon'}
                        </Button>
                    </div>
                </Modal>
            )}

            {isResultModalOpen && selectedRaceId && (
                <Modal
                    isOpen={isResultModalOpen}
                    onClose={() => setIsResultModalOpen(false)}
                    title="Manage Race Results"
                >
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Existing Results</h3>
                        {races.find(r => r.id === selectedRaceId)?.raceresults?.length > 0 ? (
                            <ul className="list-disc pl-5 text-gray-800 mb-4">
                                {races.find(r => r.id === selectedRaceId)?.raceresults.map((result) => (
                                    <li key={result.id} className="py-1">
                                        Pigeon: {result.pigeonName} - Finish Time: {new Date(result.finishTime).toLocaleTimeString()}
                                        , Speed: {result.speed || 'N/A'} km/h
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mb-4">No results available for this race.</p>
                        )}

                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Result</h3>
                        <form onSubmit={handleAddRaceResult} className="space-y-4">
                            <input
                                type="number"
                                placeholder="Pigeon ID"
                                value={pigeonIdForResult}
                                onChange={(e) => setPigeonIdForResult(e.target.value)}
                                className="p-2 border rounded w-full text-gray-800"
                            />
                            <input
                                type="datetime-local"
                                placeholder="Finish Time"
                                value={finishTime}
                                onChange={(e) => setFinishTime(e.target.value)}
                                className="p-2 border rounded w-full text-gray-800"
                            />
                            <input
                                type="number"
                                placeholder="Speed (km/h)"
                                value={speed}
                                onChange={(e) => setSpeed(e.target.value)}
                                className="p-2 border rounded w-full text-gray-800"
                            />
                            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded">
                                {loading ? 'Adding...' : 'Add Result'}
                            </Button>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
};