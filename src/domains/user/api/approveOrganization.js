import axiosInstance from "@/common/api/axiosInstance.js";

// 1. 승인 대기 중인 가입 요청 조회
export const getPendingJoinRequests = async () => {
    try {
        const { data } = await axiosInstance.get("/v1/user/approveOrganization");
        return data;
    } catch (error) {
        throw error;
    }
};

// 2. 가입 요청 상태 업데이트 (승인/거절)
export const updateJoinStatus = async (requestId, status) => {
    try {
    console.log("patch 호출")
        const { data } = await axiosInstance.patch(`/v1/user/approveOrganization/${requestId}`, { status });
        return data;
    } catch (error) {
        console.error("updateJoinStatus API error:", error);
        throw error;
    }
};