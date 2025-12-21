import {useMutation, useQueryClient} from "@tanstack/react-query";
import {enrollLectureApi} from "@/domains/lecture/api/enrollLectureApi.js";

export default function useLectureRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        // 객체로 받도록 수정
        mutationFn: ({ lectureType, lectureId }) =>
            enrollLectureApi(lectureType, lectureId),
        onSuccess: (data) => {
            console.log('강의 신청 성공:', data);
            queryClient.invalidateQueries({ queryKey: ['lecture'] });
            alert('강의 신청이 완료되었습니다.');
        },
        onError: (error) => {
            console.error('강의 신청 실패:', error);
            console.log("status : ", error.response?.status);
        }
    });
}