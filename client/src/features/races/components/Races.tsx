import React, { useEffect, useState } from 'react';
import { Navbar, Footer, Spinner, Modal, Button } from '@/components';
import { AddRaceCard, RaceCard, useRaces, Race } from '../';

export function Races() {
    const { races, loading, fetchRaces, deleteRace } = useRaces();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [raceToDelete, setRaceToDelete] = useState<Race | null>(null);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    const handleDeleteClick = (race: Race) => {
        setRaceToDelete(race);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (raceToDelete) {
            await deleteRace(raceToDelete.id);
            setIsDeleteModalOpen(false);
            setRaceToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setRaceToDelete(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Race Management</h1>
                {loading ? (
                    <div className="flex justify-center">
                        <Spinner className="w-8 h-8" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AddRaceCard />
                        {races.map((race) => (
                            <RaceCard key={race.id} race={race} onDelete={handleDeleteClick} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                title="Confirm Delete"
                className="max-w-md"
            >
                <p className="text-gray-600 mb-4">
                    Are you sure you want to delete the race{' '}
                    <span className="font-medium">{raceToDelete?.name}</span>?
                </p>
                <div className="flex justify-end space-x-2">
                    <Button onClick={handleDeleteCancel} className="bg-gray-300 hover:bg-gray-400">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
}