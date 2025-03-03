import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus, FaArrowDown, FaArrowUp } from 'react-icons/fa'; // For expand/collapse and add icons
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';
import { Modal } from '../components/common/Modal'; // Ensure you have or create this component

export const Races: React.FC = () => {
    const { races, fetchRaces, fetchBasketsByRaceId, basketPigeon, addRaceResult, loading, error } = useRaces();
    const [expandedRaceId, setExpandedRaceId] = useState<number | null>(null);
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

    const toggleExpand = (raceId: number) => {
        if (expandedRaceId === raceId) {
            setExpandedRaceId(null);
            setBaskets([]);
        } else {
            setExpandedRaceId(raceId);
            fetchBaskets(raceId);
        }
    };

    const fetchBaskets = async (raceId: number) => {
        const basketsData = await fetchBasketsByRaceId(raceId);
        setBaskets(basketsData);
    };

    const handleBasketPigeon = async (raceId: number, pigeonId: number) => {
        await basketPigeon(pigeonId, raceId);
        if (!error) {
            const updatedBaskets = await fetchBasketsByRaceId(raceId);
            setBaskets(updatedBaskets);
            toast.success('Pigeon basketed successfully!');
            setIsBasketModalOpen(false); // Close modal after success
        }
    };

    const handleAddRaceResult = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pigeonIdForResult || !expandedRaceId) {
            toast.error('Please enter a Pigeon ID and select a race.');
            return;
        }

        await addRaceResult({
            pigeonId: parseInt(pigeonIdForResult) || 0,
            raceId: expandedRaceId,
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
                            <th className="p-2 border-b text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {races.map((race) => (
                            <React.Fragment key={race.id}>
                                <tr className="hover:bg-gray-100">
                                    <td className="p-2 border-b text-gray-800">{race.name}</td>
                                    <td className="p-2 border-b text-gray-800">
                                        {new Date(race.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-2 border-b text-gray-800">{race.distance}</td>
                                    <td className="p-2 border-b text-gray-800">
                                        {race.weatherConditions || 'N/A'}
                                    </td>
                                    <td className="p-2 border-b">
                                        <Button
                                            onClick={() => toggleExpand(race.id)}
                                            className="bg-gray-800 hover:bg-gray-700 text-white py-1 px-2 rounded text-sm"
                                        >
                                            {expandedRaceId === race.id ? (
                                                <>
                                                    <FaArrowUp className="inline mr-1" /> Collapse
                                                </>
                                            ) : (
                                                <>
                                                    <FaArrowDown className="inline mr-1" /> Expand
                                                </>
                                            )}
                                        </Button>
                                    </td>
                                </tr>
                                {expandedRaceId === race.id && (
                                    <tr>
                                        <td colSpan={5} className="p-4 bg-gray-50">
                                            <div className="space-y-4">
                                                {/* Baskets Section */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        Basketed Pigeons
                                                    </h3>
                                                    {baskets.length > 0 ? (
                                                        <ul className="list-disc pl-5 text-gray-800">
                                                            {baskets.map((basket: any) => (
                                                                <li key={basket.id} className="py-1">
                                                                    {basket.pigeonName} (ID: {basket.pigeonId})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-500">No pigeons basketed for this race.</p>
                                                    )}
                                                    <Button
                                                        onClick={() => setIsBasketModalOpen(true)}
                                                        className="mt-2 bg-gray-800 hover:bg-gray-700 text-white py-1 px-2 rounded text-sm"
                                                    >
                                                        Basket Pigeon
                                                    </Button>
                                                </div>

                                                {/* Results Section */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        Race Results
                                                    </h3>
                                                    {race.raceresults?.length > 0 ? (
                                                        <ul className="list-disc pl-5 text-gray-800">
                                                            {race.raceresults.map((result) => (
                                                                <li key={result.id} className="py-1">
                                                                    Pigeon: {result.pigeonName} - Finish Time: {new Date(result.finishTime).toLocaleTimeString()}
                                                                    , Speed: {result.speed || 'N/A'} km/h
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-500">No results available for this race.</p>
                                                    )}
                                                    <Button
                                                        onClick={() => setIsResultModalOpen(true)}
                                                        className="mt-2 bg-gray-800 hover:bg-gray-700 text-white py-1 px-2 rounded text-sm"
                                                    >
                                                        Add Race Result
                                                    </Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                )}
            </main>
            <Footer />

            {/* Basket Modal */}
            {isBasketModalOpen && (
                <Modal
                    isOpen={isBasketModalOpen}
                    onClose={() => setIsBasketModalOpen(false)}
                    title="Basket Pigeon"
                >
                    <div className="p-4">
                        <input
                            type="number"
                            placeholder="Pigeon ID to Basket"
                            value={pigeonId || ''}
                            onChange={(e) => setPigeonId(parseInt(e.target.value) || null)}
                            className="p-2 border rounded w-full mb-2 text-gray-800"
                        />
                        <Button
                            onClick={() => handleBasketPigeon(expandedRaceId!, pigeonId!)}
                            disabled={!pigeonId || loading}
                            className="mt-2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
                        >
                            {loading ? 'Basketing...' : 'Basket Pigeon'}
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Race Result Modal */}
            {isResultModalOpen && expandedRaceId && (
                <Modal
                    isOpen={isResultModalOpen}
                    onClose={() => setIsResultModalOpen(false)}
                    title="Add Race Result"
                >
                    <div className="p-4">
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