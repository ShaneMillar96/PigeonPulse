import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import axiosInstance from '../utils/axiosInstance';

interface PigeonNode {
    pigeonId: number;
    ringNumber: string;
    color: string;
    sex: string;
    father?: PigeonNode;
    mother?: PigeonNode;
}

export const Pedigree: React.FC = () => {
    const { pigeonId } = useParams<{ pigeonId: string }>();
    const [pedigree, setPedigree] = useState<PigeonNode | null>(null);
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

    const renderPedigree = (node: PigeonNode | undefined, level = 0, label = 'Pigeon') => {
        if (!node) return null;

        const hasChildren = node.father || node.mother;

        return (
            <div className="relative flex flex-col items-center">
                {/* Pigeon Card */}
                <div
                    className={`border rounded-lg shadow-md p-3 md:p-4 w-36 md:w-48 text-center ${
                        node.sex === 'Male' ? 'bg-blue-50 border-blue-300' : 'bg-pink-50 border-pink-300'
                    }`}
                >
                    <p className="text-[10px] md:text-xs text-gray-500 mb-1">{label}</p>
                    <p className="font-bold text-xs md:text-sm">{node.ringNumber}</p>
                    <p className="text-xs md:text-sm">{node.color}</p>
             
                </div>

                {/* Connector Lines and Children */}
                {hasChildren && (
                    <div className="relative mt-2 md:mt-4 w-full flex justify-center">
                        {/* Vertical Line to Children */}
                        <div className="absolute top-0 left-1/2 w-px h-2 md:h-4 bg-gray-300"></div>

                        <div className="flex flex-row space-x-4 md:space-x-8 relative">
                            {/* Horizontal Line Connecting Children */}
                            <div className="absolute top-2 md:top-4 left-1/4 w-1/2 h-px bg-gray-300"></div>

                            <div className="relative flex-1">
                                {renderPedigree(node.father, level + 1, 'Father')}
                                {/* Vertical Line to Father */}
                                <div className="absolute top-[-8px] md:top-[-16px] left-1/2 w-px h-2 md:h-4 bg-gray-300"></div>
                            </div>

                            <div className="relative flex-1">
                                {renderPedigree(node.mother, level + 1, 'Mother')}
                                {/* Vertical Line to Mother */}
                                <div className="absolute top-[-8px] md:top-[-16px] left-1/2 w-px h-2 md:h-4 bg-gray-300"></div>
                            </div>
                        </div>
                    </div>
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
                        <div className="flex justify-center min-w-[300px] md:min-w-[600px] scale-75 md:scale-100 transform origin-top">
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