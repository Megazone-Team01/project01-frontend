import { Routes, Route } from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
import Home from "@/domains/home/page/Home.jsx";
import MyReservation from "@/domains/reservation/page/MyReservation.jsx";

function CommonRouter() {


    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/my/reservations" element={<MyReservation />} />
            </Route>
        </Routes>
    )
}

export default CommonRouter;