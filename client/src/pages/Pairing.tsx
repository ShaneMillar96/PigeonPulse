import React, { useEffect, useState, useRef } from 'react';
import { usePigeons } from '../hooks/usePigeons';
import { usePairing } from '../hooks/usePairing';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const Pairing: React.FC = () => {
    const { fetchAllPigeons } = usePigeons();
    const { pairPigeons, loading } = usePairing();
    const [pigeons, setPigeons] = useState([]);
    const [selectedFather, setSelectedFather] = useState(null);
    const [selectedMother, setSelectedMother] = useState(null);
    const [newPigeon, setNewPigeon] = useState({
        ringNumber: '',
        color: '',
        sex: ''
    });

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchAllPigeons().then(setPigeons);
    }, []);

    useEffect(() => {
        if (selectedFather && selectedMother && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedFather, selectedMother]);

    const malePigeons = pigeons.filter(p => p.sex === 'Male');
    const femalePigeons = pigeons.filter(p => p.sex === 'Female');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewPigeon(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreate = async () => {
        if (!selectedFather || !selectedMother) {
            toast.error('Please select both a father and a mother.');
            return;
        }

        const result = await pairPigeons({
            ringNumber: newPigeon.ringNumber,
            color: newPigeon.color,
            sex: newPigeon.sex,
            fatherId: selectedFather.id,
            motherId: selectedMother.id
        });

        if (result) {
            setNewPigeon({ ringNumber: '', color: '', sex: '' });
            setSelectedFather(null);
            setSelectedMother(null);
        }
    };

    const renderPigeonCard = (pigeon, isSelected, onClick) => (
        <div
            key={pigeon.id}
            onClick={() => onClick(pigeon)}
            className={`relative cursor-pointer p-4 border rounded-lg shadow-sm text-center ${isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'}`}
        >
            {isSelected && (
                <div className="absolute top-1 right-1 text-green-500">
                    <FaCheckCircle />
                </div>
            )}
            <img
                src={pigeon.imageUrl || '/placeholder-pigeon.png'}
                alt={pigeon.ringNumber}
                className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <p className="font-medium text-sm">{pigeon.name}</p>
            <p className="text-xs text-gray-500">{pigeon.ringNumber}</p>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Pair Pigeons</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4 text-center">Select Father (♂)</h2>
                        {selectedFather && (
                            <p className="text-center text-sm text-green-600 font-medium mb-2">Selected: {selectedFather.ringNumber}</p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {malePigeons.map(p => renderPigeonCard(p, selectedFather?.id === p.id, setSelectedFather))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4 text-center">Select Mother (♀)</h2>
                        {selectedMother && (
                            <p className="text-center text-sm text-green-600 font-medium mb-2">Selected: {selectedMother.ringNumber}</p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {femalePigeons.map(p => renderPigeonCard(p, selectedMother?.id === p.id, setSelectedMother))}
                        </div>
                    </div>
                </div>

                {selectedFather && selectedMother && (
                    <div ref={formRef} className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
                        <h2 className="text-lg font-semibold mb-4 text-center">Create New Pigeon</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                name="ringNumber"
                                placeholder="Ring Number"
                                value={newPigeon.ringNumber}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                name="color"
                                placeholder="Color"
                                value={newPigeon.color}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <select
                                name="sex"
                                value={newPigeon.sex}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="mt-4 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow disabled:opacity-50"
                            >
                                <FaPlus className="mr-2" /> {loading ? 'Creating...' : 'Create Pigeon'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};