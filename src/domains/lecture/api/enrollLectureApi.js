import axiosInstance from "@/common/api/axiosInstance.js";

export async function enrollLectureApi(lectureType,lectureId){
    try {
        console.log(lectureType,lectureId, "enrollLectureApi");
        const { data } = await axiosInstance.post(`/v1/lecture/${lectureType}/${lectureId}`);
        console.log("enrollLecture: ",data);
        return data;
    } catch (error){
        console.error("API 요청 실패:", error);
        throw new Error("데이터 요청을 실패했습니다.");
    }
}