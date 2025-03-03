import React, { useEffect, useState } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { useNavigate, useParams } from 'react-router-dom';

export const AddPigeon: React.FC = () => {
    const { createPigeon, updatePigeon, getPigeonById } = usePigeons();
    const navigate = useNavigate();
    const { pigeonId } = useParams<{ pigeonId: string }>();

    const [pigeon, setPigeon] = useState({
        name: '',
        ringNumber: '',
        color: '',
        strain: '',
    });

    useEffect(() => {
        if (pigeonId) {
            getPigeonById(Number(pigeonId)).then((data) => {
                if (data) {
                    setPigeon(data);
                }
            });
        }
    }, [pigeonId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPigeon({ ...pigeon, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pigeonId) {
            await updatePigeon(Number(pigeonId), pigeon);
        } else {
            await createPigeon(pigeon);
        }
        navigate('/pigeons');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{pigeonId ? 'Edit Pigeon' : 'Add Pigeon'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Pigeon Name"
                    value={pigeon.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="ringNumber"
                    placeholder="Ring Number"
                    value={pigeon.ringNumber}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                    disabled={!!pigeonId} // Prevent changing ring number on edit
                />
                <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={pigeon.color}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
                <input
                    type="text"
                    name="strain"
                    placeholder="Strain"
                    value={pigeon.strain}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {pigeonId ? 'Update Pigeon' : 'Add Pigeon'}
                </button>
            </form>
        </div>
    );
};
