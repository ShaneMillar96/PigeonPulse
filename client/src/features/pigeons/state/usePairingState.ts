import { useState } from 'react';

export const usePairingState = () => {
    const [loading, setLoading] = useState(false);

    return {
        loading,
        setLoading,
    };
};