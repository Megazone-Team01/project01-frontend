import axiosInstance from "@/common/api/axiosInstance.js";

// 1 최신순, 2 날짜순, 3. 인기순
export async function getLectureApi(lectureTypes, searchTypeCode=1, page,keyword = '') {
    try {
        const { data } = await axiosInstance(`v1/lecture/${lectureTypes}/courses`,{
            params: {
                searchTypeCode,
                page,
                ...(keyword && {keyword})
            }
        });
        console.log("get Lecture Api", data);
        return data;
    }catch(e) {
        console.log("api.getLectureApi: ",e);
        throw new Error("데이터 요청을 실패했습니다.");
    }
}

export async function getLectureDetailApi(lectureId,lectureType) {
    try {
        const { data } = await axiosInstance(`/v1/lecture/${lectureType}/${lectureId}`);
        console.log("get Lecture Detail Api: ", data);
        return data;
    } catch (error) {
        console.log("api.getLectureDetailApi: ", error);
        throw new Error("데이터 요청을 실패했습니다!!");
    }
}