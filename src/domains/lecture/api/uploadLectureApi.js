import axiosInstance from "@/common/api/axiosInstance.js";

export async function uploadLectureApi(formData, lectureType) {
    const url = `/v1/lecture/${lectureType}/upload`
    try{
        console.log("📍 요청 URL:", url);
        console.log(formData, "formdata 🟢")
        const { data } = await axiosInstance.post(url, formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("등록 결과 : ", data);
        return data;
    } catch(error){
        console.log("API 요청 실패", error);
        throw new Error(error.response?.data?.message || "강의 등록에 실패했습니다!");

    }
}