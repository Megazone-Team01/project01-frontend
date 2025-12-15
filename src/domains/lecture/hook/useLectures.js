import {useQuery} from "@tanstack/react-query";
import getLectureApi from "@/domains/lecture/api/getLectureApi.js";


function useLectures(lectureTypes, searchTypeCode, page, keyword=''){

    return useQuery({
        query: ['lectures', lectureTypes, searchTypeCode, page, keyword],
        queryFn:() =>getLectureApi(lectureTypes, searchTypeCode, page, keyword),
        staleTime: 5 * 60 * 1000,
        gcTime: 1000 * 60 * 1000,
        retry: 3,
        placeholderData: (prev) => prev
    })
}

export default useLectures;