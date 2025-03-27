import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { usePigeons } from '../';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../../../components';
import { FaCheckCircle, FaArrowLeft, FaTrash } from 'react-icons/fa';

export const RecordRaceResults: React.FC = () => {
    const { raceId } = useParams<{ raceId: string }>();
    const { fetchBasketsByRaceId, getRaceResults, addRaceResult, removeRaceResult, updateRaceStatus, loading: racesLoading } = useRaces();
    const { pigeons, fetchAllPigeons, loading: pigeonsLoading } = usePigeons();
    const navigate = useNavigate();

    const [baskets, setBaskets] = useState<any[]>([]);
    const [raceResults, setRaceResults] = useState<any[]>([]);
    const [selectedPigeonId, setSelectedPigeonId] = useState<number | null>(null);
    const [recordedTime, setRecordedTime] = useState('');

    useEffect(() => {
        let mounted = true; // Prevent state updates after unmount

        Promise.all([
            fetchAllPigeons(), // Fetches pigeons but doesn't set state here
            raceId ? fetchBasketsByRaceId(Number(raceId)).then((data) => mounted && setBaskets(data)) : Promise.resolve(),
            raceId ? getRaceResults(Number(raceId)).then((data) => mounted && setRaceResults(data)) : Promise.resolve(),
        ]).catch((err) => {
            console.error('Error in initial fetch:', err);
        });

        return () => {
            mounted = false; // Cleanup on unmount
        };
    }, [raceId]); // Only depend on raceId since functions are stable

    const handleAddResult = async () => {
        if (!raceId || !selectedPigeonId || !recordedTime) return;
        try {
            await addRaceResult(Number(raceId), { raceId: Number(raceId), pigeonId: selectedPigeonId, timeRecorded: recordedTime });
            const updatedResults = await getRaceResults(Number(raceId));
            setRaceResults(updatedResults);
            setSelectedPigeonId(null);
            setRecordedTime('');
        } catch (err) {
            console.error('Error adding result:', err);
        }
    };

    const handleRemoveResult = async (resultId: number) => {
        if (!raceId) return;
        try {
            await removeRaceResult(Number(raceId), resultId);
            const updatedResults = await getRaceResults(Number(raceId));
            setRaceResults(updatedResults);
        } catch (err) {
            console.error('Error removing result:', err);
        }
    };

    const handleCompleteRace = async () => {
        if (!raceId) return;
        try {
            await updateRaceStatus(Number(raceId), '3'); // '3' for Finished status
            navigate('/races');
        } catch (err) {
            console.error('Error completing race:', err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Record Race Results</h1>
                        <button onClick={() => navigate('/races')} className="text-gray-600 hover:text-gray-800">
                            <FaArrowLeft size={20} />
                        </button>
                    </div>

                    {pigeonsLoading || racesLoading ? (
                        <p className="text-center text-gray-600">Loading...</p>
                    ) : (
                        <>
                            {/* Select Pigeon */}
                            <div className="mb-4">
                                <label className="text-gray-700 font-medium">Select Pigeon</label>
                                <select
                                    className="border p-3 w-full rounded-md"
                                    value={selectedPigeonId || ''}
                                    onChange={(e) => setSelectedPigeonId(Number(e.target.value))}
                                >
                                    <option value="">Select a Pigeon</option>
                                    {baskets
                                        .filter((basket) => !raceResults.some((result) => result.pigeonId === basket.pigeonId))
                                        .map((basket) => (
                                            <option key={basket.id} value={basket.pigeonId}>
                                                {basket.pigeonName} (Ring: {basket.ringNumber})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Input Time */}
                            <div className="mb-4">
                                <label className="text-gray-700 font-medium">Recorded Time</label>
                                <input
                                    type="time"
                                    step="1"
                                    className="border p-3 w-full rounded-md"
                                    value={recordedTime}
                                    onChange={(e) => setRecordedTime(e.target.value)}
                                />
                            </div>

                            {/* Add Result Button */}
                            <button
                                onClick={handleAddResult}
                                className="bg-blue-500 text-white w-full py-3 rounded-md hover:bg-blue-600 transition"
                            >
                                Add Result
                            </button>

                            {/* Race Results Table */}
                            <div className="mt-6">
                                <h2 className="text-lg font-bold mb-2">Race Results</h2>
                                {raceResults.length === 0 ? (
                                    <p className="text-gray-600 text-center">No results recorded yet.</p>
                                ) : (
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-3 border">Pigeon</th>
                                            <th className="p-3 border">Time Recorded</th>
                                            <th className="p-3 border">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {raceResults.map((result) => (
                                            <tr key={result.id} className="border">
                                                <td className="p-3 border">{result.pigeonName}</td>
                                                <td className="p-3 border">{result.timeRecorded}</td>
                                                <td className="p-3 border text-center">
                                                    <button
                                                        onClick={() => handleRemoveResult(result.id)}
                                                        className="text-red-500 hover:text-red-700 transition"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Complete Race Button */}
                            <div className="mt-6">
                                <button
                                    onClick={handleCompleteRace}
                                    disabled={raceResults.length === 0} // Disable if no results
                                    className={`w-full py-3 rounded-md flex items-center justify-center transition ${
                                        raceResults.length === 0
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    <FaCheckCircle className="mr-2" />
                                    Complete Race
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};