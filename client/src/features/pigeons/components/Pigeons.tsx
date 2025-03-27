import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { Navbar, Footer, Input, Modal, Spinner, Button } from '@/components';
import { usePigeons, Pigeon } from '@/features/pigeons';
import PigeonCard from './PigeonCard';
import AddPigeonCard from './AddPigeonCard';

export function Pigeons() {
    const {
        pigeons,
        loading,
        hasMore,
        searchQuery,
        setSearchQuery,
        fetchPaginatedPigeons,
        deletePigeon,
        searchPigeons,
    } = usePigeons();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pigeonToDelete, setPigeonToDelete] = useState<Pigeon | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        searchPigeons(event.target.value);
    };

    const lastPigeonRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading || !hasMore) return;
            if (observer.current) observer.current.disconnect?.();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    fetchPaginatedPigeons();
                }
            });
            if (node) observer.current.observe?.(node);
        },
        [loading, hasMore, fetchPaginatedPigeons]
    );

    useEffect(() => {
        fetchPaginatedPigeons();
    }, [fetchPaginatedPigeons]);

    const handleDeleteClick = (pigeon: Pigeon) => {
        setPigeonToDelete(pigeon);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (pigeonToDelete) {
            await deletePigeon(pigeonToDelete.id);
            searchPigeons(searchQuery);
            setIsDeleteModalOpen(false);
            setPigeonToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setPigeonToDelete(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Pigeons</h1>

                <div className="relative mb-6 max-w-lg mx-auto">
                    <Input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        placeholder="Search by ring number..."
                        value={searchQuery}
                        onChange={handleSearch}
                        icon={<FaSearch className="text-gray-500" />}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AddPigeonCard />

                    {pigeons.map((pigeon, index) => (
                        <PigeonCard
                            key={pigeon.id}
                            pigeon={pigeon}
                            onDelete={handleDeleteClick}
                            ref={index === pigeons.length - 1 ? lastPigeonRef : null}
                        />
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center my-4">
                        <Spinner />
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
                    Are you sure you want to delete pigeon with ring number{' '}
                    <span className="font-medium">{pigeonToDelete?.ringNumber}</span>?
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