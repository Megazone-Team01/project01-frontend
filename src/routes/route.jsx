import { Routes, Route } from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
import About from "@/routes/About.jsx";
import UserOrganizationListPage from "../domains/organization/page/UserOrganizationListPage.jsx";
import UserOrganizationDetailPage from "../domains/organization/page/UserOrganizationDetailPage.jsx";
import Home from "@/domains/home/page/Home.jsx";
import Sign from "@/domains/user/page/Sign.jsx";
import AdminMainPage from "@/domains/admin/page/AdminMainPage.jsx";
import OnlineLecturePlayingPage from "@/domains/lecture/page/OnlineLecturePlayingPage.jsx";
import Offline from "@/domains/lecture/offline/page/Offline.jsx";
import OfflineDetail from "@/domains/lecture/offline/page/OfflineDetail.jsx";
import Online from "@/domains/lecture/online/page/Online.jsx";
import OnlineDetail from "@/domains/lecture/online/page/OnlineDetail.jsx";
import LectureLayout from "@/domains/lecture/components/Layout/LectureLayout.jsx";


import MyReservation from "@/domains/reservation/page/MyReservation.jsx";
import RoomList from "@/domains/room/page/RoomList.jsx";
import Login from "@/domains/user/page/Login.jsx";
import PublicRoute from "@/routes/PublicRoute.jsx";

function CommonRouter() {


    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<CardWithForm />}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/organizations" element={<UserOrganizationListPage />} />
                <Route path="/organization/:id" element={<UserOrganizationDetailPage />} />
                <Route path="/" element={<Home />}/>
                <Route path="/admin" element={<AdminMainPage /> } />
                <Route path="/online/:id" element={<OnlineLecturePlayingPage /> } />

                {/* 로그인 상태면 접근 제한 */}
                <Route path="/sign" element={<PublicRoute><Sign /></PublicRoute>}/>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
                <Route path="/lecture" element={<LectureLayout/>}>
                    <Route path="offline" element={<Offline />}/>
                    <Route path="offline/:offlineId" element={<OfflineDetail />} />

                    <Route path="online" element={<Online />}/>
                    <Route path="online/:onlineId" element={<OnlineDetail />} />
                </Route>

          
                <Route path="/reservations/my" element={<MyReservation />} />
                <Route path="/rooms" element={<RoomList />} />
                {/* <Route path="/room/:roomId" element={<RoomReserve />} /> */}
                <Route path="/sign" element={<Sign />} />
                <Route path="/login" element={<Login />}/>
            </Route>
        </Routes>
    )
}

export default CommonRouter;

