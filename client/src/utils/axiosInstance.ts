import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5264/api', // Local backend URL
});

// Add interceptors (e.g., for auth tokens later)
axiosInstance.interceptors.request.use(
    (config) => {
        // Add token here if implementing JWT later
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;