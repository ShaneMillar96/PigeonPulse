import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { usePairingState } from '../states/usePairingState';

export const usePairing = () => {
    const { loading, setLoading } = usePairingState();

    const pairPigeons = async ({
                                   ringNumber,
                                   color,
                                   sex,
                                   fatherId,
                                   motherId,
                               }) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/pigeon/pair', {
                ringNumber,
                color,
                sex,
                fatherId,
                motherId,
            });

            toast.success('Pigeon created successfully!');
            return response.data;
        } catch (error) {
            console.error(error);
            toast.error('Failed to create paired pigeon.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        pairPigeons,
        loading,
    };
};