import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components';
import { Pigeon } from '@/features/pigeons';
import { FaPlus, FaTrash } from 'react-icons/fa'; 
interface PigeonCardProps {
    pigeon: Pigeon & { pigeonName?: string }; // Extend Pigeon to include pigeonName for basketed pigeons
    isBasketed: boolean;
    onAction: (id: number) => void;
}

export function BasketPigeonCard({ pigeon, isBasketed, onAction }: PigeonCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
        >
            <div className="flex items-center">
                <img
                    src="/placeholder-pigeon.png"
                    alt={`Pigeon ${pigeon.ringNumber}`}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <p className="text-sm font-medium text-gray-800">{pigeon.pigeonName || pigeon.ringNumber}</p>
                    <p className="text-xs text-gray-500">Ring: {pigeon.ringNumber}</p>
                </div>
            </div>
            <Button
                onClick={() => onAction(isBasketed ? (pigeon as any).id : pigeon.id)} // basketed pigeon has id from basket, available pigeon has id from pigeon
                className={`px-3 py-1 rounded flex items-center text-sm ${
                    isBasketed ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
                {isBasketed ? (
                    <>
                        <FaTrash className="mr-1" /> Remove
                    </>
                ) : (
                    <>
                        <FaPlus className="mr-1" /> Add
                    </>
                )}
            </Button>
        </motion.div>
    );
}