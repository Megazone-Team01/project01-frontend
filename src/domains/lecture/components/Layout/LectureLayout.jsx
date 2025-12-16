import {Outlet, useParams} from "react-router";
import Banner from "@/domains/lecture/components/common/Banner.jsx";
import SearchBox from "@/domains/lecture/components/common/SearchBox.jsx";

function LectureLayout() {
    const {onlineId, offlineId} = useParams();
    const isDetailPage = Boolean(onlineId || offlineId);

    return (
        <div className="flex flex-col gap-3.5 max-w-7xl mx-auto">
            <div>
                <Banner/>

                {!isDetailPage && <SearchBox />}
            </div>
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Outlet/>
            </div>
        </div>
    )
}

export default LectureLayout;