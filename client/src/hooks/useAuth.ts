import { useAuthState } from '../states/useAuthState';
import { useRegister } from './useRegister';
import { useLogin } from './useLogin';
import { useLogout } from './useLogout';

export const useAuth = () => {
    const { user, loading, error } = useAuthState();
    const { register } = useRegister();
    const { login } = useLogin();
    const { logout } = useLogout();

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    return { user, loading, error, register, login, logout, isAuthenticated };
};