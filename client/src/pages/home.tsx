import React from 'react';
import { Navbar, Footer } from '../components';
import { useAuth } from '../features/auth';
import PigeonLogo from '../../public/pigeonpulse-logo.png';
import { Link } from 'react-router-dom';
import { FaDove, FaFlagCheckered, FaChartLine, FaHeart } from 'react-icons/fa';

export const Home: React.FC = () => {
    const { isAuthenticated } = useAuth(); // Check if user is authenticated

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center text-center">
                {/* Hero Section */}
                <div className="max-w-3xl">
                    <img src={PigeonLogo} alt="PigeonPulse Logo" className="mx-auto w-40 h-auto" />
                    <h1 className="text-4xl font-extrabold text-gray-800 mt-6">Welcome to PigeonPulse</h1>
                    <p className="text-lg text-gray-600 mt-4">
                        A modern platform for racing pigeon fanciers to track, manage, and compete in pigeon races.
                    </p>
                </div>

                {/* Conditionally Render Quick Links */}
                {isAuthenticated() ? (
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Link
                            to="/dashboard"
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center"
                        >
                            <FaChartLine className="text-blue-500 text-4xl" />
                            <h2 className="text-xl font-semibold mt-3">Dashboard</h2>
                            <p className="text-gray-600 mt-2 text-sm">View analytics and insights on your races and pigeons.</p>
                        </Link>

                        <Link
                            to="/pigeons"
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center"
                        >
                            <FaDove className="text-blue-500 text-4xl" />
                            <h2 className="text-xl font-semibold mt-3">Manage Pigeons</h2>
                            <p className="text-gray-600 mt-2 text-sm">Add, edit, and track your pigeons.</p>
                        </Link>

                        <Link
                            to="/races"
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center"
                        >
                            <FaFlagCheckered className="text-green-500 text-4xl" />
                            <h2 className="text-xl font-semibold mt-3">Race Management</h2>
                            <p className="text-gray-600 mt-2 text-sm">Create and participate in races.</p>
                        </Link>

                        <Link
                            to="/pair-pigeons"
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center"
                        >
                            <FaHeart className="text-red-500 text-4xl" />
                            <h2 className="text-xl font-semibold mt-3">Pairing</h2>
                            <p className="text-gray-600 mt-2 text-sm">Pair pigeons to create offspring.</p>
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-lg text-center">
                        <h2 className="text-xl font-bold text-gray-800">Join PigeonPulse Today</h2>
                        <p className="text-gray-600 mt-2">
                            Sign up or log in to start managing your pigeons and races.
                        </p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
                                Login
                            </Link>
                            <Link to="/register" className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">
                                Register
                            </Link>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};