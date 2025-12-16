import axios from 'axios'
import store from "@/store/store";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터: 항상 Redux에서 accessToken 가져와서 첨부
axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;