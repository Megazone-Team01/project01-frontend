
import {useDispatch, useSelector} from "react-redux";
import {setPage} from "@/common/store/lecture/lectureStore.js";
import useLectures from "@/domains/lecture/hook/useLectures.js";

function Offline() {
    const dispatch = useDispatch();
    const {searchKeword, searchType, page}= useSelector((state) => state.lecture);
    const {
        data:offlineData,
        isLoading,
        isError
    } = useLectures("offline", searchType, page, searchKeword);

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
    };

    console.log("offlineData: ", offlineData);
    console.log("loading..:",isLoading);
    console.log("isError: ",isError);

    return (
        <div>
            offline
        </div>
    )
}

export default Offline;