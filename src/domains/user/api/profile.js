import axiosInstance from "@/common/api/axiosInstance.js";

// 마이페이지 조회
export const getProfileInfo = async () => {
    try {
        const { data } = await axiosInstance.get("/v1/user/profile");
        return data;
    } catch (error) {
        console.error("Get My Info API error:", error);
        throw error;
    }
};

// 마이페이지 내 정보 업데이트
export const updateProfileInfo = async (userData) => {
    try {
        const res = await axiosInstance.put("/v1/user/profile", userData);
        return res.data;
    } catch (error) {
        alert( error.response.data.message )
        throw error;
      }
};

// 마이페이지 내 탈퇴 버튼 클릭 시 회원 탈퇴
export const deleteProfileAccount = async () => {
    try {
        const res = await axiosInstance.delete("/v1/user/profile");
        return res;
    } catch( error ){
        if( error.status === 401 ) alert( error.response.data.message )
        throw error;
    }
};
