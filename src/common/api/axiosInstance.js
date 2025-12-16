import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default axiosInstance;