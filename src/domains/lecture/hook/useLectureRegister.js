import {useMutation, useQueryClient} from "@tanstack/react-query";
import {enrollLectureApi} from "@/domains/lecture/api/enrollLectureApi.js";
import {useDispatch} from "react-redux";
import {setEnrolled} from "@/common/store/lecture/lectureSlice.js";

export default function useLectureRegister() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        // 객체로 받도록 수정
        mutationFn: ({ lectureType, lectureId }) =>{
           return enrollLectureApi(lectureType, lectureId)
        },
        onSuccess: (data) => {
            console.log('강의 신청 성공:', data);
            dispatch(setEnrolled(data.enrolled));
            queryClient.invalidateQueries({ queryKey: ['lecture'] });
            alert('강의 신청이 완료되었습니다.');
        },
        onError: (error) => {
            console.error('강의 신청 실패:', error);
            console.log("status : ", error.response?.status);
        }
    });
}