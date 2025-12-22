import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {getLectureApi} from "@/domains/lecture/api/getLectureApi.js";


function useLectures(lectureTypes, searchTypeCode, page, keyword = ''){
    return useQuery({
        queryKey: ['lectures', lectureTypes, searchTypeCode, page, keyword],
        queryFn:() => getLectureApi(lectureTypes, searchTypeCode, page, keyword),
        enabled: keyword.trim().length > 0 || keyword === '', // 빈 문자열도 허용
        staleTime: 5 * 60 * 1000,
        gcTime: 1000 * 60 * 1000,
        retry: 3,
        placeholderData: keepPreviousData
    })
}

export default useLectures;