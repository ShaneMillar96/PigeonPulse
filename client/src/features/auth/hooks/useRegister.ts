import { useAuthState, RegisterRequest } from '../';
import axiosInstance from '../../../lib/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useRegister = () => {
    const { setUser, setLoading, setError } = useAuthState();
    const navigate = useNavigate();

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/auth/register', data);
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

    return { register };
};