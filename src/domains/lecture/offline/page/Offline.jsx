
import {useDispatch, useSelector} from "react-redux";
import {setPage} from "@/common/store/lecture/lectureSlice.js";
import useLectures from "@/domains/lecture/hook/useLectures.js";
import Loading from "@/components/common/loading.jsx";
import CourseCard from "@/domains/lecture/components/common/CourseCard.jsx";
import PageNation from "@/domains/lecture/components/common/PageNation.jsx";
import ErrorPage from "@/components/common/ErrorPage.jsx";

function Offline() {
    const dispatch = useDispatch();
    const {searchKeyword, searchType, page}= useSelector((state) => state.lecture);
    console.log(searchKeyword,"searchKeyword");
    const {
        data: offlineList,
        isLoading,
        isError,
    } = useLectures("offline", searchType, page, searchKeyword);

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
    };

    if(isError) {
        return <ErrorPage />
    }

    console.log("offline", offlineList);

    return (
        <div className="flex flex-col">
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 mb-20">
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
                ) : <Loading/>}
            </div>
                <PageNation
                    currentPage={offlineList?.currentPage}
                    totalPages={offlineList?.totalPages}
                    totalElements={offlineList?.totalPages}
                    hasPrevious={offlineList?.hasPrevious}
                    hasNext={offlineList?.hasNext}
                    onPageChange={handlePageChange}
                />

            </div>
            )
}

export default Offline;