import Header from "@/components/layout/Header.jsx";
import {Outlet} from "react-router";


function MainLayout(){
    return (
        <>
            <div className="py-20 px-20 h-[200vh]">
                <Header />
                <Outlet/>
            </div>
        </>
    )
}

export default MainLayout;