import {Routes, Route} from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
import About from "@/routes/About.jsx";
import UserOrganizationListPage from "../domains/organization/page/UserOrganizationListPage.jsx";
import UserOrganizationDetailPage from "../domains/organization/page/UserOrganizationDetailPage.jsx";
import Home from "@/domains/home/page/Home.jsx";

function CommonRouter(){
    return  (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<CardWithForm />}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/organizations" element={<UserOrganizationListPage />} />
                <Route path="/organization/:id" element={<UserOrganizationDetailPage />} />
                <Route path="/" element={<Home />}/>
            </Route>
        </Routes>
    )
}

export default CommonRouter;