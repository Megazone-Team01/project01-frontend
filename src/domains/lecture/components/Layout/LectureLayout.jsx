import {Outlet} from "react-router";
import Banner from "@/domains/lecture/components/common/Banner.jsx";
import SearchBox from "@/domains/lecture/components/common/SearchBox.jsx";

function LectureLayout() {
    return (
        <div>
            <div>
                <Banner title={""}/>
                <SearchBox/>
            </div>
            <Outlet/>
        </div>
    )
}

export default LectureLayout;