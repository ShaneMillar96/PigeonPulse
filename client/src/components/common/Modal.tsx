// Optional: Simple Modal component (../components/common/Modal.tsx)
import React from 'react';

export const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
                <div>{children}</div>
                <button
                    onClick={onClose}
                    className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};