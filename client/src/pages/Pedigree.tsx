import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import axiosInstance from '../utils/axiosInstance';

export const Pedigree: React.FC = () => {
    const { pigeonId } = useParams();
    const [pedigree, setPedigree] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedigree = async () => {
            try {
                const response = await axiosInstance.get(`/pigeon/${pigeonId}/pedigree?generations=4`);
                setPedigree(response.data);
            } catch (error) {
                console.error('Error fetching pedigree:', error);
            } finally {
                setLoading(false);
            }
        };

        if (pigeonId) {
            fetchPedigree();
        }
    }, [pigeonId]);

    const renderPedigree = (node, level = 0, label = 'Pigeon') => {
        if (!node) return null;

        return (
            <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-white border border-gray-300 p-4 rounded shadow w-44">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className="font-bold text-sm">{node.ringNumber}</p>
                        <p className="text-sm">{node.color}</p>
                        <p className="text-xs italic text-gray-500">{node.sex}</p>
                    </div>

                    {(node.father || node.mother) && (
                        <div className="mt-2 flex space-x-6">
                            {renderPedigree(node.father, level + 1, 'Father')}
                            {renderPedigree(node.mother, level + 1, 'Mother')}
                        </div>
                    )}
                </div>

                {level === 0 && (node.father || node.mother) && (
                    <div className="h-px bg-gray-400 flex-1 mx-2" />
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Pigeon Pedigree</h1>

                {loading ? (
                    <p className="text-center text-gray-500">Loading pedigree...</p>
                ) : pedigree ? (
                    <div className="overflow-x-auto">
                        <div className="flex items-start space-x-6 justify-center">
                            {renderPedigree(pedigree)}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-red-500">Pedigree data not available.</p>
                )}
            </main>
            <Footer />
        </div>
    );
};