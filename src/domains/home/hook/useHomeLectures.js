import {useQuery} from "@tanstack/react-query";
import {getLectureApi} from "@/domains/home/api/getLectureApi.js";

export default function useHomeLectures(activeTab) {
    const { data: lectures, isLoading } = useQuery({
        queryKey:['lectures',activeTab], //캐싱키 구분
        queryFn:() => getLectureApi(activeTab), //api 요청
        retry: 3, // 실패시 데이터 요청 3번까지 요청하기
        staleTime:10 *60 * 1000, // 10분에 한번씩 새로운 데이터 요청
        placeholderData: (prev) => prev
        // eact Query는 새 데이터를 가져오는 동안 이전 데이터를 그대로 화면에 보여줌
    });
    console.log("react query: ",lectures);
    return {lectures, isLoading};
}