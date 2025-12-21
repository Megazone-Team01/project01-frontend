import {Outlet, useParams} from "react-router";
import Banner from "@/domains/lecture/components/common/Banner.jsx";
import SearchBox from "@/domains/lecture/components/common/SearchBox.jsx";

function LectureLayout() {
    const {onlineId, offlineId} = useParams();
    const isDetailPage = Boolean(onlineId || offlineId);

    return (
        <div className="flex flex-col gap-3.5 max-w-7xl mx-auto">
            <div>
                {!isDetailPage && <SearchBox />}
            </div>

            <Outlet/>

        </div>
    )
}

export default LectureLayout;