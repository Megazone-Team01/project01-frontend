import axiosInstance from "@/common/api/axiosInstance.js";

export async function enrollLectureApi(lectureType,lectureId){
    const url = `/v1/lecture/${lectureType}/${lectureId}`;
    console.log("📍 실제 요청 URL:", url);
    console.log("📍 lectureType:", lectureType, "타입:", typeof lectureType);
    console.log("📍 lectureId:", lectureId, "타입:", typeof lectureId);
    try {
        console.log(lectureType,lectureId, "enrollLectureApi");
        const { data } = await axiosInstance.post(url);
        console.log("enrollLecture: ",data);

        return data;
    } catch (error){
        console.error("API 요청 실패:", error);
        alert(error.response?.data?.message);
        throw new Error("데이터 요청을 실패했습니다.");
    }
}