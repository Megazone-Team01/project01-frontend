import {useMutation, useQueryClient} from "@tanstack/react-query";
import cancelLectureApi from "@/domains/lecture/api/cancelLectureApi.js";
import {setEnrolled} from "@/common/store/lecture/lectureSlice.js";
import {useDispatch} from "react-redux";


export default function useLectureCancel () {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({lectureId, lectureType}) =>{
           return cancelLectureApi(lectureId, lectureType)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`lecture cancel`] });
            dispatch(setEnrolled(false));
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