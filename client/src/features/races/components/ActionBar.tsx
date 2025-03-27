import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components';
import { FaCheckCircle } from 'react-icons/fa';
interface ActionBarProps {
    hasBaskets: boolean;
    onComplete: () => void;
    onBack: () => void;
}

export function ActionBar({ hasBaskets, onComplete, onBack }: ActionBarProps) {
    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-center gap-4 border-t"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
        >
            {hasBaskets && (
                <Button
                    onClick={onComplete}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
                >
                    <FaCheckCircle className="mr-2" /> Complete Basket
                </Button>
            )}
            <Button
                onClick={onBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
                Back to Races
            </Button>
        </motion.div>
    );
}