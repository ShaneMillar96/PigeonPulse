import { useAuthState, useRegister, useLogin, useLogout } from '../';

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