import {useMutation, useQueryClient} from "@tanstack/react-query";
import cancelLectureApi from "@/domains/lecture/api/cancelLectureApi.js";


export default function useLectureCancel () {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({lectureId, lectureType}) =>{
            cancelLectureApi(lectureId, lectureType)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`lecture cancel`] });
            alert("강의 신청이 취소되었습니다.");
        },
        onError: (error) => {
            console.error('강의 취소 실패:', error);

            const errorData = error.response?.data;
            const errorMessage = errorData?.message || '강의 취소 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
    });
}