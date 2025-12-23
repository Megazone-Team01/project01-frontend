import axiosInstance from "@/common/api/axiosInstance.js";

export const signup = async(userData) => {
    try {
        const res = await axiosInstance.post("/v1/user/signup", userData);
        return res.data;
    } catch (error) {
        alert( error.response.data.message )
        throw error;
    }
};