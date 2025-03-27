import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Button } from '@/components';
import { Pigeon } from '../';

interface SelectedParentCardProps {
    parent: Pigeon;
    label: string;
    onDeselect: () => void;
}

export function SelectedParentCard({ parent, label, onDeselect }: SelectedParentCardProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
                <img
                    src={parent.imageUrl || '/placeholder-pigeon.png'}
                    alt={parent.ringNumber}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{parent.ringNumber}</p>
                </div>
            </div>
            <Button
                variant="icon"
                onClick={onDeselect}
                className="text-red-500 hover:text-red-600"
            >
                <FaTimes size={20} />
            </Button>
        </div>
    );
}