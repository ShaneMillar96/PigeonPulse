import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { RegisterRequest, LoginRequest, User } from '../interfaces/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null); // Optional: keep for user data if needed
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Check if user is authenticated by checking the token
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token; // Return true if token exists, false otherwise
    };

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<User>('/auth/register', data);
            setUser(response.data);
            setError(null);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            setError('Registration failed');
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<{ token: string }>('/auth/login', data);
            const token = response.data.token;
            localStorage.setItem('token', token); // Store token
            setError(null);
            toast.success('Login successful!');
            navigate('/');
        } catch (err) {
            setError('Login failed');
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null); // Clear user state (optional)
        localStorage.removeItem('token'); // Remove JWT token
        setError(null); // Clear any errors
        navigate('/'); // Redirect to home page
        toast.info('Logged out successfully!');
    };

    return { user, loading, error, register, login, logout, isAuthenticated }; // Add isAuthenticated
};