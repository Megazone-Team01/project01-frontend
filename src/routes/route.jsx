import {Routes, Route} from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
import Home from "@/domains/home/page/Home.jsx";
import Sign from "@/domains/user/page/Sign.jsx";
import AdminMainPage from "@/domains/admin/page/AdminMainPage.jsx";

function CommonRouter(){
    return  (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home />}/>
                <Route path="/sign" element={<Sign />}/>
                <Route path="/admin" element={<AdminMainPage /> } />
            </Route>
        </Routes>
    )
}

export default CommonRouter;