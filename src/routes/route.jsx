import {Routes, Route} from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
import Home from "@/domains/home/page/Home.jsx";
import Sign from "@/domains/user/page/Sign.jsx";
import AdminMainPage from "@/domains/admin/page/AdminMainPage.jsx";
import OnlineLecturePlayingPage from "@/domains/lecture/page/OnlineLecturePlayingPage.jsx";

function CommonRouter(){
    return  (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home />}/>
                <Route path="/sign" element={<Sign />}/>
                <Route path="/admin" element={<AdminMainPage /> } />
                <Route path="/online/:id" element={<OnlineLecturePlayingPage /> } />
            </Route>
        </Routes>
    )
}

export default CommonRouter;