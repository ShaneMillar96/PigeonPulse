import React from 'react';
import { Link } from 'react-router-dom';
import PigeonLogo from '../../../public/pigeonpulse-logo.png';

export const Navbar: React.FC = () => (
    <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-lg font-bold">
                <img src={PigeonLogo} alt="PigeonPulse Logo" className="w-8 h-8" />
                PigeonPulse
            </Link>
            <div>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </div>
    </nav>
);