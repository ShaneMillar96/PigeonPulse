import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar, Footer, Spinner, Tab, Button } from '@/components';
import { useRaces, Basket, BasketPigeonCard, ActionBar } from '../';
import { usePigeons, Pigeon } from '@/features/pigeons';

export function RaceBasket() {
    const { raceId } = useParams<{ raceId: string }>();
    const navigate = useNavigate();
    const { fetchBasketsByRaceId, addPigeonToBasket, removePigeonFromBasket, updateRaceStatus, loading: racesLoading } = useRaces();
    const { fetchAllPigeons, loading: pigeonsLoading } = usePigeons();

    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [pigeons, setPigeons] = useState<Pigeon[]>([]);
    const [activeTab, setActiveTab] = useState<'available' | 'basketed'>('available');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetchAllPigeons().then(setPigeons),
            raceId ? fetchBasketsByRaceId(Number(raceId)).then(setBaskets) : Promise.resolve(),
        ]).catch((err) => {
            console.error('Error in initial fetch:', err);
            setError('Failed to load initial data');
        });
    }, [raceId, fetchAllPigeons, fetchBasketsByRaceId]);

    const availablePigeons = pigeons.filter((pigeon) => !baskets.some((basket) => basket.pigeonId === pigeon.id));

    const handleAddPigeon = async (pigeonId: number) => {
        if (!raceId) {
            setError('Race ID is missing');
            return;
        }
        try {
            setError(null);
            await addPigeonToBasket(Number(raceId), pigeonId);
            const updatedBaskets = await fetchBasketsByRaceId(Number(raceId));
            setBaskets(updatedBaskets);
        } catch (err) {
            console.error('Error adding pigeon:', err);
            setError('Failed to add pigeon to basket');
        }
    };

    const handleRemovePigeon = async (basketId: number) => {
        try {
            setError(null);
            await removePigeonFromBasket(basketId);
            const updatedBaskets = await fetchBasketsByRaceId(Number(raceId));
            setBaskets(updatedBaskets);
        } catch (err) {
            console.error('Error removing pigeon:', err);
            setError('Failed to remove pigeon from basket');
        }
    };

    const handleCompleteBasket = async () => {
        if (raceId) {
            try {
                setError(null);
                await updateRaceStatus(Number(raceId), '2');
                navigate('/races');
            } catch (err) {
                console.error('Error completing basket:', err);
                setError('Failed to complete basket');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Manage Race Basket</h1>

                {/* Error Message */}
                {error && <p className="text-center text-red-500 mb-4">{error}</p>}

                {/* Tab Navigation */}
                <div className="flex justify-center mb-4">
                    <Tab
                        label="Available Pigeons"
                        count={availablePigeons.length}
                        isActive={activeTab === 'available'}
                        onClick={() => setActiveTab('available')}
                    />
                    <Tab
                        label="Basketed Pigeons"
                        count={baskets.length}
                        isActive={activeTab === 'basketed'}
                        onClick={() => setActiveTab('basketed')}
                    />
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-4 max-h-[60vh] overflow-y-auto">
                    {pigeonsLoading || racesLoading ? (
                        <div className="flex justify-center">
                            <Spinner className="w-8 h-8" />
                        </div>
                    ) : activeTab === 'available' ? (
                        availablePigeons.length === 0 ? (
                            <p className="text-center text-gray-600">No available pigeons.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                <AnimatePresence>
                                    {availablePigeons.map((pigeon) => (
                                        <BasketPigeonCard
                                            key={pigeon.id}
                                            pigeon={pigeon}
                                            isBasketed={false}
                                            onAction={handleAddPigeon}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )
                    ) : baskets.length === 0 ? (
                        <p className="text-center text-gray-600">No pigeons in basket yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            <AnimatePresence>
                                {baskets.map((basket) => (
                                    <BasketPigeonCard
                                        key={basket.id}
                                        pigeon={basket}
                                        isBasketed={true}
                                        onAction={handleRemovePigeon}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <ActionBar
                    hasBaskets={baskets.length > 0}
                    onComplete={handleCompleteBasket}
                    onBack={() => navigate('/races')}
                />
            </main>
            <Footer />
        </div>
    );
}