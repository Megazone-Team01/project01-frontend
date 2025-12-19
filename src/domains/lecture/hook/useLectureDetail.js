import {useQuery} from "@tanstack/react-query";
import {getLectureDetailApi} from "@/domains/lecture/api/getLectureApi.js";

function useLectureDetail(lectureId,lectureType) {
    return useQuery({
        queryKey:["lectureDetail", lectureId, lectureType],
        queryFn:() => getLectureDetailApi(lectureId, lectureType),
        retry: 3,
        staleTime:10 *60 * 1000,
        gcTime:10 *60 * 1000,
        placeholderData: (prev) => prev
    })
}

export default useLectureDetail;