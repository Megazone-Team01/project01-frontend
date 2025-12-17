import axios from 'axios'
import store from "@/store/store";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터
// 요청 인터셉터: 항상 Redux에서 accessToken 가져와서 첨부
axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
//axiosInstance.interceptors.response.use(
//    (res) => res,
//    async (error) => {
//        const originalRequest = error.config;
//        const { status, data } = error.response || {};
//
//        // 이미 재시도한 요청이면 그대로 에러
//        if (originalRequest?._retry) {
//            return Promise.reject(error);
//        }
//
//        // Access Token 만료 → 재발급 시도
//        if (status === 401 && data?.code === "TOKEN_EXPIRED") {
//            originalRequest._retry = true;
//
//        try {
//            // refresh 요청은 인터셉터 안 타도록 axios 직접 사용
//            const res = await axios.post(
//                `${import.meta.env.VITE_API_URL}/auth/refresh`,
//                {},
//                { withCredentials: true } // refreshToken 쿠키 사용 시
//            );
//
//            const { accessToken, user } = res.data;
//
//            // Redux 갱신
//            store.dispatch(
//                loginSuccess({
//                    accessToken,
//                    user,
//                })
//            );
//
//            // 실패했던 요청에 새 토큰 주입
//            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//
//            // 요청 재시도
//            return axiosInstance(originalRequest);
//        } catch {
//            store.dispatch(logout());
//            return Promise.reject(error);
//        }
//    }
//
//    // Refresh Token 만료 → 강제 로그아웃
//    if (status === 401 && data?.code === "REFRESH_TOKEN_EXPIRED") {
//        store.dispatch(logout());
//    }
//
//    return Promise.reject(error);
//}
);

export default axiosInstance;