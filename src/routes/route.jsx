import {Routes, Route} from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
import Home from "@/domains/home/page/Home.jsx";
import Sign from "@/domains/user/page/Sign.jsx";
import Login from "@/domains/user/page/Login.jsx";
import PublicRoute from "@/routes/PublicRoute.jsx";

function CommonRouter(){
    return  (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home />}/>

                {/* 로그인 상태면 접근 제한 */}
                <Route path="/sign" element={<PublicRoute><Sign /></PublicRoute>}/>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
            </Route>
        </Routes>
    )
}

export default CommonRouter;