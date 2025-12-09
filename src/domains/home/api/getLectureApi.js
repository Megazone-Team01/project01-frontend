import axiosInstance from "@/common/api/axiosInstance.js";

export async function getLectureApi(activeTab) {
    try {
        const {data} = await axiosInstance.get(`/home?type=${activeTab}`);
        return data; // axios는 data에 실제 응답이 들어있음
    } catch (error) {
        console.error("API 요청 실패:", error);
        throw new Error("데이터 요청을 실패했습니다.");
    }
}