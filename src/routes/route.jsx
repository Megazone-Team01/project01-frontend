import {Routes, Route} from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
import Home from "@/domains/home/page/Home.jsx";
import Sign from "@/domains/user/page/Sign.jsx";

function CommonRouter(){
    return  (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home />}/>
                <Route path="/sign" element={<Sign />}/>
            </Route>
        </Routes>
    )
}

export default CommonRouter;