import React from 'react';

interface TabProps {
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
}

export function Tab({ label, count, isActive, onClick }: TabProps) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 font-semibold rounded-t-lg ${
                isActive ? 'bg-white text-blue-600 shadow-md' : 'bg-gray-200 text-gray-600'
            }`}
        >
            {label} ({count})
        </button>
    );
}