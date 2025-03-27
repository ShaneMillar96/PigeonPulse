import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

export function AddRaceCard() {
    return (
        <Link
            to="/add-race"
            className="bg-white flex flex-col justify-center items-center h-40 border-2 border-dashed rounded-lg shadow-sm hover:border-gray-400 transition"
        >
            <FaPlus size={40} className="text-gray-500" />
            <p className="text-gray-500">Add New Race</p>
        </Link>
    );
}