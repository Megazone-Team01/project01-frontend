import {useDispatch, useSelector} from "react-redux";
import useLectures from "@/domains/lecture/hook/useLectures.js";
import {setPage} from "@/common/store/lecture/lectureSlice.js";
import CourseCard from "@/domains/lecture/components/common/CourseCard.jsx";
import Loading from "@/components/common/loading.jsx";
import PageNation from "@/domains/lecture/components/common/PageNation.jsx";

function Online() {
    const dispatch = useDispatch();
    const {searchKeword, searchType, page}= useSelector((state) => state.lecture);
    const {
        data:onlineList,
        isLoading,
        isError
    } = useLectures("online", searchType, page, searchKeword);

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
    };

    if(isError) {
        return <div>error</div>
    }

    console.log("onlineData: ", onlineList);
    return (
        <div className="flex flex-col">
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 mb-20">
                {!isLoading ? (
                    onlineList?.onlineList.map(online => (
                        <CourseCard
                            key={online.id}
                            id={online.id}
                            imgUrl="https://picsum.photos/400/200"
                            title={online.title}
                            startAt={online.startTime}
                            endAt={online.endTime}
                            description={online.description}
                        />
                    ))
                ) : <Loading />}
            </div>

            <PageNation
                currentPage={onlineList?.currentPage}
                totalPages={onlineList?.totalPages}
                totalElements={onlineList?.totalPages}
                hasPrevious={onlineList?.hasPrevious}
                hasNext={onlineList?.hasNext}
                onPageChange={handlePageChange}
            />
        </div>
    );

}
export default Online;