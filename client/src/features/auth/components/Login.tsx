import React, { useState } from 'react';
import { useLogin } from '../';
import { Navbar, Footer } from '../../../components';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export const Login: React.FC = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login, loading, error } = useLogin();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(form);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Login to PigeonPulse</h1>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                className="border border-gray-300 rounded-md pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                className="border border-gray-300 rounded-md pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-blue-500 hover:underline text-sm">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-md text-white font-semibold transition ${
                                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};