import React, { useEffect, useState } from 'react';
import { useRaces } from '../hooks/useRaces';
import { useNavigate, useParams } from 'react-router-dom';

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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{raceId ? 'Edit Race' : 'Add Race'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Race Name"
                    value={race.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={race.date}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="number"
                    name="distance"
                    placeholder="Distance (km)"
                    value={race.distance}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {raceId ? 'Update Race' : 'Add Race'}
                </button>
            </form>
        </div>
    );
};
