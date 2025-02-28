import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { RegisterRequest, LoginRequest, User } from '../interfaces/auth';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<User>('/auth/register', data);
            console.log(response);
            setUser(response.data);
            setError(null);
        } catch (err) {
            setError('Registration failed');
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
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, register, login };
};