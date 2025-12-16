import axiosInstance from "@/common/api/axiosInstance.js";

export const login = async(userData) => {
    try {
        const { data } = await axiosInstance.post("/v1/user/login", userData);
        return data;
    } catch (error) {
            console.error("Login API error:", error);
            throw error;
    }
};