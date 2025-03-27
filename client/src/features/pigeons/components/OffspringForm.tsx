import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Input, Button, Spinner } from '@/components';
import { NewPigeon } from '../';
import { Pigeon as PigeonType, SelectedParentCard } from '../';

interface OffspringFormProps {
    newPigeon: Omit<NewPigeon, 'fatherId' | 'motherId'>;
    selectedFather: PigeonType;
    selectedMother: PigeonType;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCreate: () => void;
    onDeselectFather: () => void;
    onDeselectMother: () => void;
    loading: boolean;
    error: string | null;
}

export function OffspringForm({
    newPigeon,
    selectedFather,
    selectedMother,
    onInputChange,
    onCreate,
    onDeselectFather,
    onDeselectMother,
    loading,
    error,
    }: OffspringFormProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Step 3: Create Offspring</h2>
            <div className="space-y-4">
                {/* Display Selected Parents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <SelectedParentCard parent={selectedFather} label="Father" onDeselect={onDeselectFather} />
                    <SelectedParentCard parent={selectedMother} label="Mother" onDeselect={onDeselectMother} />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {/* Offspring Form */}
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ring Number</label>
                        <Input
                            type="text"
                            name="ringNumber"
                            placeholder="Enter ring number"
                            value={newPigeon.ringNumber}
                            onChange={onInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <Input
                            type="text"
                            name="color"
                            placeholder="Enter color"
                            value={newPigeon.color}
                            onChange={onInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                        <Input
                            as="select"
                            name="sex"
                            value={newPigeon.sex}
                            onChange={onInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Input>
                    </div>

                    <Button
                        onClick={onCreate}
                        disabled={loading}
                        className="mt-4 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md disabled:opacity-50 transition-all"
                    >
                        {loading ? (
                            <Spinner className="w-5 h-5 mr-2" />
                        ) : (
                            <FaPlus className="mr-2" />
                        )}
                        {loading ? 'Creating...' : 'Create Offspring'}
                    </Button>
                </div>
            </div>
        </div>
    );
}