import {useDispatch, useSelector} from "react-redux";
import useLectures from "@/domains/lecture/hook/useLectures.js";
import {setPage} from "@/common/store/lecture/lectureStore.js";


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
    console.log("onlineData: ", onlineList);
    return (
        <>
            <div>online</div>
        </>
    )
}

export default Online;