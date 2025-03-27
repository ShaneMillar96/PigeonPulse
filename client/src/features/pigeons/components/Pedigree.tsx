import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer, Spinner, Button } from '@/components';
import { usePedigree, PedigreeTree } from '../';

export function Pedigree() {
    const { pigeonId } = useParams<{ pigeonId: string }>();
    const navigate = useNavigate();
    const { pedigree, loading, error } = usePedigree(pigeonId);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Pigeon Pedigree</h1>
                    <Button
                        onClick={() => navigate('/pigeons')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                        Back to Pigeons
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <Spinner className="w-8 h-8" />
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : pedigree ? (
                    <PedigreeTree pedigree={pedigree} />
                ) : (
                    <p className="text-center text-red-500">Pedigree data not available.</p>
                )}
            </main>
            <Footer />
        </div>
    );
}