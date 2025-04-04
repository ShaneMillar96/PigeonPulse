import React, { useEffect, useState } from 'react';
import { usePigeons, PigeonRequest } from '../';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Footer } from '../../../components';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';

export const AddPigeon: React.FC = () => {
    const { createPigeon, updatePigeon, getPigeonById } = usePigeons(); // Extract functions from usePigeons
    const navigate = useNavigate();
    const { pigeonId } = useParams<{ pigeonId: string }>();

    const [pigeon, setPigeon] = useState<PigeonRequest>({
        ringNumber: '',
        color: '',
        sex: '',
        imageUrl: '',
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (pigeonId && !isLoaded) {
            getPigeonById(Number(pigeonId)).then((data) => {
                if (data) {
                    setPigeon({
                        ringNumber: data.ringNumber,
                        color: data.color || '',
                        sex: data.sex || '',
                        imageUrl: data.imageUrl || '',
                    });
                    setIsLoaded(true);
                }
            });
        }
    }, [pigeonId, getPigeonById, isLoaded]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPigeon({ ...pigeon, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setPigeon({ ...pigeon, imageUrl });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (pigeonId) {
                await updatePigeon(Number(pigeonId), pigeon);
            } else {
                await createPigeon(pigeon);
            }
            navigate('/pigeons');
        } catch (error) {
            console.error('Error saving pigeon:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6 flex flex-col items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {pigeonId ? 'Edit Pigeon' : 'Add Pigeon'}
                        </h1>
                        <button onClick={() => navigate('/pigeons')} className="text-gray-600 hover:text-gray-800">
                            <FaArrowLeft size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center mb-4">
                        <div className="w-32 h-32 border border-gray-300 rounded-full overflow-hidden">
                            <img
                                src={pigeon.imageUrl || '/placeholder-pigeon.png'}
                                alt="Pigeon"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <label className="mt-2 flex items-center text-blue-500 cursor-pointer">
                            <FaUpload className="mr-2" />
                            Upload Image
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="ringNumber"
                            placeholder="Ring Number"
                            value={pigeon.ringNumber}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-md"
                            required
                            disabled={!!pigeonId}
                        />
                        <input
                            type="text"
                            name="color"
                            placeholder="Color"
                            value={pigeon.color}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-md"
                        />
                        <select
                            name="sex"
                            value={pigeon.sex}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-md"
                            required
                        >
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white w-full py-3 rounded-md hover:bg-blue-600 transition"
                        >
                            {pigeonId ? 'Update Pigeon' : 'Add Pigeon'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};