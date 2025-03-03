import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, type = 'button', disabled }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded disabled:bg-gray-400"
    >
        {children}
    </button>
);