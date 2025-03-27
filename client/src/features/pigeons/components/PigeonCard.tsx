import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSitemap } from 'react-icons/fa';
import { Button } from '@/components';
import { Pigeon } from '@/features/pigeons';

interface PigeonCardProps {
    pigeon: Pigeon;
    onDelete: (pigeonId: number) => void;
}

export default function PigeonCard({ pigeon, onDelete }: PigeonCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <div className="w-24 h-24 mb-4">
                <img
                    src={pigeon.imageUrl || '/placeholder-pigeon.png'} // Updated path for public assets
                    alt={pigeon.ringNumber}
                    className="rounded-full border border-gray-300 object-cover w-full h-full"
                />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{pigeon.ringNumber}</h2>
            <p className="text-gray-600">
                Ring Number: <span className="font-medium">{pigeon.ringNumber}</span>
            </p>

            <div className="flex space-x-4 mt-4">
                <Link to={`/edit-pigeon/${pigeon.id}`}>
                    <Button variant="icon" className="text-blue-500 hover:text-blue-700">
                        <FaEdit size={20} />
                    </Button>
                </Link>
                <Button
                    variant="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(pigeon.id)}
                >
                    <FaTrash size={20} />
                </Button>
                {pigeon.fatherId && pigeon.motherId && (
                    <Link to={`/pedigree/${pigeon.id}`} title="View Pedigree">
                        <Button variant="icon" className="text-green-600 hover:text-green-800">
                            <FaSitemap size={20} />
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}