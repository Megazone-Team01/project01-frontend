import {Routes, Route} from "react-router";
import CardWithForm from "@/pageCard.jsx";
import MainLayout from "@/components/layout/MainLayout.jsx";
import About from "@/routes/About.jsx";

function CommonRouter(){
    return  (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<CardWithForm />}/>
                <Route path="/about" element={<About/>}/>
            </Route>
        </Routes>
    )
}

export default CommonRouter;