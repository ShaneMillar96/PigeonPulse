import React, { useEffect, useState } from 'react';
import { Navbar, Footer } from '@/components';
import { usePairing, NewPigeon, usePigeons, Pigeon, ParentCard, SelectedParentCard, OffspringForm } from '../';

export function Pairing() {
    const { fetchAllPigeons } = usePigeons();
    const { pairPigeons, loading } = usePairing();
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [selectedFather, setSelectedFather] = useState<Pigeon | null>(null);
    const [selectedMother, setSelectedMother] = useState<Pigeon | null>(null);
    const [newPigeon, setNewPigeon] = useState<Omit<NewPigeon, 'fatherId' | 'motherId'>>({
        ringNumber: '',
        color: '',
        sex: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllPigeons().then(setPigeons);
    }, [fetchAllPigeons]);

    const malePigeons = pigeons.filter((p) => p.sex === 'Male');
    const femalePigeons = pigeons.filter((p) => p.sex === 'Female');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewPigeon((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreate = async () => {
        if (!selectedFather || !selectedMother) {
            setError('Please select both a father and a mother.');
            return;
        }

        if (!newPigeon.ringNumber || !newPigeon.color || !newPigeon.sex) {
            setError('Please fill in all fields for the new pigeon.');
            return;
        }

        setError(null);

        const result = await pairPigeons({
            ringNumber: newPigeon.ringNumber,
            color: newPigeon.color,
            sex: newPigeon.sex as 'Male' | 'Female',
            fatherId: selectedFather.id,
            motherId: selectedMother.id,
        });

        if (result) {
            setNewPigeon({ ringNumber: '', color: '', sex: '' });
            setSelectedFather(null);
            setSelectedMother(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Pair Pigeons</h1>

                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Step 1: Select Father */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4 text-center">Step 1: Select Father (♂)</h2>
                        {selectedFather ? (
                            <SelectedParentCard
                                parent={selectedFather}
                                label="Father"
                                onDeselect={() => setSelectedFather(null)}
                            />
                        ) : (
                            <>
                                <p className="text-center text-sm text-gray-500 mb-4">
                                    Choose a male pigeon to be the father.
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {malePigeons.map((p) => (
                                        <ParentCard
                                            key={p.id}
                                            pigeon={p}
                                            isSelected={selectedFather?.id === p.id}
                                            onClick={setSelectedFather}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Step 2: Select Mother (only visible after selecting father) */}
                    {selectedFather && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-4 text-center">Step 2: Select Mother (♀)</h2>
                            {selectedMother ? (
                                <SelectedParentCard
                                    parent={selectedMother}
                                    label="Mother"
                                    onDeselect={() => setSelectedMother(null)}
                                />
                            ) : (
                                <>
                                    <p className="text-center text-sm text-gray-500 mb-4">
                                        Choose a female pigeon to be the mother.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {femalePigeons.map((p) => (
                                            <ParentCard
                                                key={p.id}
                                                pigeon={p}
                                                isSelected={selectedMother?.id === p.id}
                                                onClick={setSelectedMother}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Create Offspring (only visible after selecting both parents) */}
                    {selectedFather && selectedMother && (
                        <OffspringForm
                            newPigeon={newPigeon}
                            selectedFather={selectedFather}
                            selectedMother={selectedMother}
                            onInputChange={handleInputChange}
                            onCreate={handleCreate}
                            onDeselectFather={() => setSelectedFather(null)}
                            onDeselectMother={() => setSelectedMother(null)}
                            loading={loading}
                            error={error}
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}