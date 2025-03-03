import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaArrowLeft, FaCalendarAlt, FaRoad } from 'react-icons/fa';

export const AddRace: React.FC = () => {
    const { createRace, updateRace, getRaceById } = useRaces();
    const navigate = useNavigate();
    const { raceId } = useParams<{ raceId: string }>();

    const [race, setRace] = useState({
        name: '',
        date: '',
        distance: '',
    });

    useEffect(() => {
        if (raceId) {
            getRaceById(Number(raceId)).then((data) => {
                if (data) {
                    setRace({
                        name: data.name,
                        date: new Date(data.date).toISOString().split('T')[0],
                        distance: data.distance.toString(),
                    });
                }
            });
        }
    }, [raceId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRace({ ...race, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (raceId) {
            await updateRace(Number(raceId), race);
        } else {
            await createRace(race);
        }
        navigate('/races');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6 flex flex-col items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {raceId ? 'Edit Race' : 'Add Race'}
                        </h1>
                        <button onClick={() => navigate('/races')} className="text-gray-600 hover:text-gray-800">
                            <FaArrowLeft size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Race Name */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium">Race Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter race name"
                                value={race.name}
                                onChange={handleChange}
                                className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>

                        {/* Race Date */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium flex items-center">
                                <FaCalendarAlt className="mr-2" />
                                Race Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={race.date}
                                onChange={handleChange}
                                className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>

                        {/* Race Distance */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium flex items-center">
                                <FaRoad className="mr-2" />
                                Distance (km)
                            </label>
                            <input
                                type="number"
                                name="distance"
                                placeholder="Enter distance in km"
                                value={race.distance}
                                onChange={handleChange}
                                className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white w-full py-3 rounded-md hover:bg-blue-600 transition"
                        >
                            {raceId ? 'Update Race' : 'Add Race'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};
