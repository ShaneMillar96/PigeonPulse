import { useAuthState } from '../states/useAuthState';
import axiosInstance from '../utils/axiosInstance';
import { LoginRequest } from '../interfaces/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useLogin = () => {
    const { setLoading, setError } = useAuthState();
    const navigate = useNavigate();

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<{ token: string }>('/auth/login', data);
            const token = response.data.token;
            localStorage.setItem('token', token);
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

    return { login };
};