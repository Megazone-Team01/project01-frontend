import axiosInstance from "@/common/api/axiosInstance.js";

// 마이페이지 조회
export const getMyInfo = async () => {
    try {
        const { data } = await axiosInstance.get("/v1/user/profile");
        console.log(data);
        return data;
    } catch (error) {
        console.error("Get My Info API error:", error);
        throw error;
    }
};

// 마이페이지 내 정보 업데이트
export const updateMyInfo = async (userData) => {
    try {
        const res = await axiosInstance.put("/v1/user/profile", userData);
        return res.data;
    } catch (error) {
        console.error("Update My Info API error:", error);
        throw error;
    }
};

// 마이페이지 내 탈퇴 버튼 클릭 시 회원 탈퇴
export const deleteMyAccount = async () => {
    try {
        const res = await axiosInstance.delete("/v1/user/profile");
        return res.data;
    } catch (error) {
        console.error("Delete Account API error:", error);
        throw error;
    }
};

//// 마이페이지 내 나의 강의들을 보기
//export const getMyLectures = async () => {
//    try {
//        const res = await axiosInstance.get("/v1/user/my/lectures");
//        return res.data;
//    } catch (error) {
//        console.error("Get My Lectures API error:", error);
//        throw error;
//    }
//};
//
//// 마이페이지 내 내가 속한 조직들 확인
//export const getMyOrganizations = async () => {
//    try {
//        const res = await axiosInstance.get("/v1/user/my/organizations");
//        return res.data;
//    } catch (error) {
//        console.error("Get My Organizations API error:", error);
//        throw error;
//    }
//};