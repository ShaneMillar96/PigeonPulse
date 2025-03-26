import React, { useEffect, useState } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { usePairing } from '../hooks/usePairing';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaPlus, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Pigeon {
    id: number;
    name: string;
    ringNumber: string;
    sex: string;
    imageUrl?: string;
}

interface NewPigeon {
    ringNumber: string;
    color: string;
    sex: string;
}

export const Pairing: React.FC = () => {
    const { fetchAllPigeons } = usePigeons();
    const { pairPigeons, loading } = usePairing();
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [selectedFather, setSelectedFather] = useState<Pigeon | null>(null);
    const [selectedMother, setSelectedMother] = useState<Pigeon | null>(null);
    const [newPigeon, setNewPigeon] = useState<NewPigeon>({
        ringNumber: '',
        color: '',
        sex: '',
    });

    useEffect(() => {
        fetchAllPigeons().then(setPigeons);
    }, []);

    const malePigeons = pigeons.filter((p) => p.sex === 'Male');
    const femalePigeons = pigeons.filter((p) => p.sex === 'Female');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewPigeon((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreate = async () => {
        if (!selectedFather || !selectedMother) {
            toast.error('Please select both a father and a mother.');
            return;
        }

        if (!newPigeon.ringNumber || !newPigeon.color || !newPigeon.sex) {
            toast.error('Please fill in all fields for the new pigeon.');
            return;
        }

        const result = await pairPigeons({
            ringNumber: newPigeon.ringNumber,
            color: newPigeon.color,
            sex: newPigeon.sex,
            fatherId: selectedFather.id,
            motherId: selectedMother.id,
        });

        if (result) {
            setNewPigeon({ ringNumber: '', color: '', sex: '' });
            setSelectedFather(null);
            setSelectedMother(null);
        }
    };

    const renderPigeonCard = (pigeon: Pigeon, isSelected: boolean, onClick: (pigeon: Pigeon) => void) => (
        <div
            key={pigeon.id}
            onClick={() => onClick(pigeon)}
            className={`relative cursor-pointer p-4 border rounded-lg shadow-sm text-center transition-all duration-200 ${
                isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'
            }`}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 text-green-500">
                    <FaCheckCircle size={20} />
                </div>
            )}
            <img
                src={pigeon.imageUrl || '/placeholder-pigeon.png'}
                alt={pigeon.ringNumber}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <p className="font-semibold text-sm text-gray-800">{pigeon.name}</p>
            <p className="text-xs text-gray-500">{pigeon.ringNumber}</p>
        </div>
    );

    const renderSelectedParent = (parent: Pigeon | null, label: string, onDeselect: () => void) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
                <img
                    src={parent?.imageUrl || '/placeholder-pigeon.png'}
                    alt={parent?.ringNumber}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-sm text-gray-600">{parent?.name}</p>
                    <p className="text-xs text-gray-500">{parent?.ringNumber}</p>
                </div>
            </div>
            <button
                onClick={onDeselect}
                className="text-red-500 hover:text-red-600 transition-colors"
            >
                <FaTimes size={20} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Pair Pigeons</h1>

                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Step 1: Select Father */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Step 1: Select Father (♂)
                        </h2>
                        {selectedFather ? (
                            renderSelectedParent(selectedFather, 'Father', () => setSelectedFather(null))
                        ) : (
                            <>
                                <p className="text-center text-sm text-gray-500 mb-4">
                                    Choose a male pigeon to be the father.
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {malePigeons.map((p) =>
                                        renderPigeonCard(p, selectedFather?.id === p.id, setSelectedFather)
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Step 2: Select Mother (only visible after selecting father) */}
                    {selectedFather && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-4 text-center">
                                Step 2: Select Mother (♀)
                            </h2>
                            {selectedMother ? (
                                renderSelectedParent(selectedMother, 'Mother', () => setSelectedMother(null))
                            ) : (
                                <>
                                    <p className="text-center text-sm text-gray-500 mb-4">
                                        Choose a female pigeon to be the mother.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {femalePigeons.map((p) =>
                                            renderPigeonCard(p, selectedMother?.id === p.id, setSelectedMother)
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Create Offspring (only visible after selecting both parents) */}
                    {selectedFather && selectedMother && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-4 text-center">
                                Step 3: Create Offspring
                            </h2>
                            <div className="space-y-4">
                                {/* Display Selected Parents */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    {renderSelectedParent(selectedFather, 'Father', () => setSelectedFather(null))}
                                    {renderSelectedParent(selectedMother, 'Mother', () => setSelectedMother(null))}
                                </div>

                                {/* Offspring Form */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ring Number
                                        </label>
                                        <input
                                            type="text"
                                            name="ringNumber"
                                            placeholder="Enter ring number"
                                            value={newPigeon.ringNumber}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Color
                                        </label>
                                        <input
                                            type="text"
                                            name="color"
                                            placeholder="Enter color"
                                            value={newPigeon.color}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sex
                                        </label>
                                        <select
                                            name="sex"
                                            value={newPigeon.sex}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        >
                                            <option value="">Select Sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleCreate}
                                        disabled={loading}
                                        className="mt-4 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md disabled:opacity-50 transition-all"
                                    >
                                        <FaPlus className="mr-2" /> {loading ? 'Creating...' : 'Create Offspring'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};