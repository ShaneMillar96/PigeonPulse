import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PigeonLogo from '../../../public/pigeonpulse-logo.png';
import { useAuth } from '../../hooks/useAuth';
import { FaBars, FaTimes } from 'react-icons/fa';

export const Navbar: React.FC = () => {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo & Title */}
                <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center space-x-2 text-lg font-bold">
                        <img src={PigeonLogo} alt="PigeonPulse Logo" className="w-8 h-8" />
                        <span className="hidden md:block">PigeonPulse</span>
                    </Link>
                </div>

                {/* Desktop Navigation (Only for Authenticated Users) */}
                {isAuthenticated() && (
                    <div className="hidden md:flex space-x-6">
                        <Link to="/pigeons" className="hover:text-gray-300 transition">Pigeons</Link>
                        <Link to="/races" className="hover:text-gray-300 transition">Races</Link>
                        <Link to="/dashboard" className="hover:text-gray-300 transition">Dashboard</Link>
                    </div>
                )}

                {/* Logout Button for Authenticated Users */}
                {isAuthenticated() && (
                    <div className="hidden md:flex">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Mobile Menu Button */}
                {isAuthenticated() && (
                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                )}
            </div>

            {/* Mobile Menu for Authenticated Users */}
            {isAuthenticated() && isMenuOpen && (
                <div className="md:hidden bg-gray-800 p-4 mt-2 shadow-lg">
                    <Link to="/pigeons" className="block py-2 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Pigeons</Link>
                    <Link to="/races" className="block py-2 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Races</Link>
                    <Link to="/dashboard" className="block py-2 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <div className="mt-4 border-t border-gray-600 pt-2">
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};
