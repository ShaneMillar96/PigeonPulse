import { useState } from 'react';
import { User } from '../';

export const useAuthState = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return { user, setUser, loading, setLoading, error, setError };
};