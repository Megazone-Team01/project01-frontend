import axiosInstance from "../common/api/axiosInstance";


// 새 AccessToken 발급
export async function getNewAccessToken(refreshToken) {
    const response = await axiosInstance.post("/auth/refresh", { refreshToken });
    return response.data;
}