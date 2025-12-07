import {Routes, Route} from "react-router";
import CardWithForm from "@/pageCard.jsx";
import MainLayout from "@/components/layout/MainLayout.jsx";
import Home from "@/domains/home/page/Home.jsx";

function CommonRouter(){
    return  (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home />}/>
            </Route>
        </Routes>
    )
}

export default CommonRouter;