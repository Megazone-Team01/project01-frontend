
import {useDispatch, useSelector} from "react-redux";
import {setPage} from "@/common/store/lecture/lectureStore.js";
import useLectures from "@/domains/lecture/hook/useLectures.js";
import Loading from "@/components/common/loading.jsx";
import CourseCard from "@/domains/lecture/components/common/CourseCard.jsx";

function Offline() {
    const dispatch = useDispatch();
    const {searchKeword, searchType, page}= useSelector((state) => state.lecture);


    const {
        data: offlineList,
        isLoading,
        isError
    } = useLectures("offline", searchType, page, searchKeword);

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
    };
    console.log("offline", offlineList);
    return (
        <>
            {!isLoading ? (
                offlineList?.offlineList.map(offline => (
                    <CourseCard
                        key={offline.id}
                        id={offline.id}
                        imgUrl="https://picsum.photos/400/200"
                        title={offline.title}
                        startAt={offline.startTime}
                        endAt={offline.endTime}
                        description={offline.description}/>
                ))
            ):<Loading/>}
        </>
    )
}

export default Offline;