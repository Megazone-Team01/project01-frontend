import {useMutation} from "@tanstack/react-query";
import {uploadLectureApi} from "@/domains/lecture/api/uploadLectureApi.js";



export function useUploadLecture(lectureType) {
    return useMutation({
        mutationFn: (formData) => uploadLectureApi(formData, lectureType),
        onSuccess: (data) =>{
            console.log('강의 등록 성공:', data);
            alert('강의가 성공적으로 등록되었습니다!');
        },
        onError: (error) => {
            console.log("강의 등록 실패: ", error);
            alert("error.message");
        }

    })
}