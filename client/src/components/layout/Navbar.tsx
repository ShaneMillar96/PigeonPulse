import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PigeonLogo from '../../../public/pigeonpulse-logo.png';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth

export const Navbar: React.FC = () => {
    const { logout, isAuthenticated } = useAuth(); // Use isAuthenticated instead of user
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center space-x-2 text-lg font-bold">
                        <img src={PigeonLogo} alt="PigeonPulse Logo" className="w-8 h-8" />
                        PigeonPulse
                    </Link>
                    {isAuthenticated() && (
                        <>
                            <Link to="/pigeons" className="hover:text-gray-300">Pigeons</Link>
                            <Link to="/races" className="hover:text-gray-300">Races</Link>
                        </>
                    )}
                </div>
                <div>
                    {isAuthenticated() ? (
                        <button
                            onClick={handleLogout}
                            className="mr-4 text-white hover:text-gray-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};