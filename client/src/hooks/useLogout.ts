import { useAuthState } from './useAuthState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useLogout = () => {
    const { setUser, setError } = useAuthState();
    const navigate = useNavigate();

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        setError(null);
        navigate('/');
        toast.info('Logged out successfully!');
    };

    return { logout };
};