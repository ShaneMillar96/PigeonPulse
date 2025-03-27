import React from 'react';

interface SpinnerProps {
    className?: string;
}

export function Spinner({ className = '' }: SpinnerProps) {
    return (
        <div
            className={`border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin ${className}`}
        />
    );
}