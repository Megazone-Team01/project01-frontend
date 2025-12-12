import axiosInstance from "@/common/api/axiosInstance.js";

export const login = async(userData) => {
    try {
        const res = await axiosInstance.post("/v1/user/login", userData);
        return res.data;
    } catch (error) {
            console.error("Login API error:", error);
            throw error;
    }
};
