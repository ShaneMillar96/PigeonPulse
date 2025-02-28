import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { RegisterRequest, LoginRequest, User } from '../interfaces/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify'; // Import toast

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<User>('/auth/register', data);
            console.log(response);
            setUser(response.data);
            setError(null);
            toast.success('Registration successful! Please log in.'); // Show success toast
        } catch (err) {
            setError('Registration failed');
            toast.error('Registration failed. Please try again.'); // Show error toast
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<User>('/auth/login', data);
            setUser(response.data);
            setError(null);
            toast.success('Login successful!'); // Show success toast
            navigate('/pigeons'); // Navigate to Pigeons page after successful login
        } catch (err) {
            setError('Login failed');
            toast.error('Login failed. Please try again.'); // Show error toast
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, register, login };
};