import Header from "@/components/layout/Header.jsx";
import {Outlet} from "react-router";
import Footer from "@/components/layout/Footer.jsx";



function MainLayout( { online, setOnline} ){
    return (
        <>
            <div className="min-h-screen pt-25 pb-50 px-4 sm:px-8 md:px-30">
                <Header online={online} setOnline={setOnline} />
                <div className="max-w-9xl mx-auto">
                    <Outlet/>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default MainLayout;