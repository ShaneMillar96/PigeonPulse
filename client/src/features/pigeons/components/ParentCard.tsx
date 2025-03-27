import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Pigeon } from '../';

interface PigeonCardProps {
    pigeon: Pigeon;
    isSelected: boolean;
    onClick: (pigeon: Pigeon) => void;
}

export function ParentCard({ pigeon, isSelected, onClick }: PigeonCardProps) {
    return (
        <div
            onClick={() => onClick(pigeon)}
            className={`relative cursor-pointer p-4 border rounded-lg shadow-sm text-center transition-all duration-200 ${
                isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'
            }`}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 text-green-500">
                    <FaCheckCircle size={20} />
                </div>
            )}
            <img
                src={pigeon.imageUrl || '/placeholder-pigeon.png'}
                alt={pigeon.ringNumber}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <p className="text-xs text-gray-500">{pigeon.ringNumber}</p>
        </div>
    );
}