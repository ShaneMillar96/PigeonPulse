import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaPlus, FaShoppingBasket, FaTrophy, FaTachometerAlt } from 'react-icons/fa';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { RaceResult } from '../interfaces/race';

export const Races: React.FC = () => {
    const {
        races,
        pigeons,
        fetchRaces,
        fetchBasketsByRaceId,
        basketPigeon,
        removePigeonFromBasket,
        saveBasket,
        addRaceResult,
        getRaceLeaderboard,
        loading,
        error,
    } = useRaces();
    const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
    const [baskets, setBaskets] = useState<any[]>([]);
    const [selectedPigeons, setSelectedPigeons] = useState<number[]>([]);
    const [isBasketModalOpen, setIsBasketModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
    const [pigeonIdForResult, setPigeonIdForResult] = useState('');
    const [speed, setSpeed] = useState('');
    const [finishTime, setFinishTime] = useState('');
    const [leaderboard, setLeaderboard] = useState<RaceResult[]>([]);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    const fetchBaskets = async (raceId: number) => {
        setSelectedRaceId(raceId);
        const basketsData = await fetchBasketsByRaceId(raceId);
        setBaskets(basketsData);
        setSelectedPigeons(basketsData.map((b) => b.pigeonId));
        setIsBasketModalOpen(true);
    };

    const handleAddPigeonToBasket = async (pigeonId: number) => {
        if (!selectedRaceId) return;
        await basketPigeon({ pigeonId, raceId: selectedRaceId });
        const updatedBaskets = await fetchBasketsByRaceId(selectedRaceId);
        setBaskets(updatedBaskets);
        setSelectedPigeons(updatedBaskets.map((b) => b.pigeonId));
    };

    const handleRemovePigeonFromBasket = async (basketId: number) => {
        if (!selectedRaceId) return;
        await removePigeonFromBasket(basketId);
        const updatedBaskets = await fetchBasketsByRaceId(selectedRaceId);
        setBaskets(updatedBaskets);
        setSelectedPigeons(updatedBaskets.map((b) => b.pigeonId));
    };

    const handleSaveBasket = async () => {
        if (!selectedRaceId) return;
        await saveBasket(selectedRaceId);
        setIsBasketModalOpen(false);
    };

    const handleAddRaceResult = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pigeonIdForResult || !selectedRaceId) {
            toast.error('Please enter a Pigeon ID.');
            return;
        }
        await addRaceResult({
            pigeonId: parseInt(pigeonIdForResult),
            raceId: selectedRaceId,
            finishTime: finishTime || new Date().toISOString(),
            speed: speed ? parseFloat(speed) : null,
        });
        if (!error) {
            setPigeonIdForResult('');
            setSpeed('');
            setFinishTime('');
            setIsResultModalOpen(false);
        }
    };

    const fetchLeaderboard = async (raceId: number) => {
        const leaderboardData = await getRaceLeaderboard(raceId);
        setLeaderboard(leaderboardData);
        setIsLeaderboardModalOpen(true);
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
                            <th className="p-2 border-b text-left">Status</th>
                            <th className="p-2 border-b text-left">Actions</th>
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
                                <td className="p-2 border-b text-gray-800">{race.raceStatus}</td>
                                <td className="p-2 border-b flex space-x-2">
                                    {['New', 'Basketed'].includes(race.raceStatus) && (
                                        <Button
                                            onClick={() => fetchBaskets(race.id)}
                                            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
                                            aria-label="Basket Pigeons"
                                        >
                                            <FaShoppingBasket className="text-lg" />
                                        </Button>
                                    )}
                                    {['Basketed', 'Finished'].includes(race.raceStatus) && (
                                        <Button
                                            onClick={() => {
                                                setSelectedRaceId(race.id);
                                                setIsResultModalOpen(true);
                                            }}
                                            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
                                            aria-label="Add/View Results"
                                        >
                                            <FaTrophy className="text-lg" />
                                        </Button>
                                    )}
                                    {race.raceStatus === 'Finished' && (
                                        <Button
                                            onClick={() => fetchLeaderboard(race.id)}
                                            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
                                            aria-label="View Leaderboard"
                                        >
                                            <FaTachometerAlt className="text-lg" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </main>
            <Footer />

            {/* Basket Modal */}
            <Modal
                isOpen={isBasketModalOpen}
                onClose={() => setIsBasketModalOpen(false)}
                title="Manage Basket"
            >
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Pigeons to Basket</h3>
                    <select
                        value=""
                        onChange={(e) => handleAddPigeonToBasket(parseInt(e.target.value))}
                        className="p-2 border rounded w-full mb-4 text-gray-800"
                    >
                        <option value="">Select a Pigeon...</option>
                        {pigeons
                            .filter((p) => !selectedPigeons.includes(p.id))
                            .map((pigeon) => (
                                <option key={pigeon.id} value={pigeon.id}>
                                    {pigeon.name} - {pigeon.ringNumber}
                                </option>
                            ))}
                    </select>

                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Basketed Pigeons</h3>
                    {baskets.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-800 mb-4">
                            {baskets.map((basket) => (
                                <li key={basket.id} className="py-1 flex justify-between items-center">
                                    {basket.pigeonName} (ID: {basket.pigeonId})
                                    <Button
                                        onClick={() => handleRemovePigeonFromBasket(basket.id)}
                                        className="ml-4 bg-red-600 hover:bg-red-500 text-white py-1 px-2 rounded text-sm"
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mb-4">No pigeons basketed.</p>
                    )}

                    <Button
                        onClick={handleSaveBasket}
                        disabled={loading || baskets.length === 0}
                        className="mt-4 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
                    >
                        {loading ? 'Saving...' : 'Save Basket'}
                    </Button>
                </div>
            </Modal>

            {/* Race Result Modal */}
            {selectedRaceId && (
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
                                required
                            />
                            <input
                                type="datetime-local"
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
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
                            >
                                {loading ? 'Adding...' : 'Add Result'}
                            </Button>
                        </form>
                    </div>
                </Modal>
            )}

            {/* Leaderboard Modal */}
            <Modal
                isOpen={isLeaderboardModalOpen}
                onClose={() => setIsLeaderboardModalOpen(false)}
                title="Race Leaderboard"
            >
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Leaderboard</h3>
                    {leaderboard.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-800">
                            {leaderboard.map((result, index) => (
                                <li key={result.id} className="py-1">
                                    #{index + 1} - {result.pigeonName} - Finish: {new Date(result.finishTime).toLocaleString()}
                                    , Speed: {result.speed ? `${result.speed} km/h` : 'N/A'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No results available.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};