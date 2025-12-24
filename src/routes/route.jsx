import { Routes, Route } from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
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

import MyReservationPage from "@/domains/reservation/page/MyReservationPage";
import TeacherDashboard from "@/domains/meeting/page/TeacherDashboard";
import RoomList from "@/domains/room/page/RoomList.jsx";
import Login from "@/domains/user/page/Login.jsx";
import ApproveOrganization from "@/domains/user/page/ApproveOrganization.jsx";

import PublicRoute from "@/routes/PublicRoute.jsx";
import PrivateRoute from "@/routes/PrivateRoute.jsx";
import Profile from "@/domains/user/page/Profile.jsx";
import AdminRoute from "@/routes/AdminRoute.js";
import OfflineUpload from "@/domains/lecture/upload/page/OfflineUpload.jsx";
import OnlineUpload from "@/domains/lecture/upload/page/OnlineUpload.jsx";
import {SSEProvider} from "@/routes/SSEContext.jsx";
import {Provider} from "react-redux";
import store from "@/common/store/index.js";
import {useState} from "react";

function CommonRouter() {
    const [ online, setOnline ] = useState(true);

    return (
        <Provider store={store}>
            <SSEProvider>
                <Routes>
                    <Route element={<MainLayout online={online} setOnline={setOnline} />}>
                        <Route path="/organizations" element={<UserOrganizationListPage />} />
                        <Route path="/organization/:id" element={<UserOrganizationDetailPage />} />
                        <Route path="/" element={<Home online={online} />} />
                        <Route path="/admin" element={<AdminRoute><AdminMainPage /></AdminRoute>} />
                        <Route path="/online/:id" element={<OnlineLecturePlayingPage />} />

                        {/* 로그인 상태면 접근 제한 */}
                        <Route path="/sign" element={<PublicRoute><Sign /></PublicRoute>} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/offline/upload" element={<OfflineUpload />} />
                        <Route path="/online/upload" element={<OnlineUpload />} />
                        <Route path="/lecture" element={<LectureLayout />}>
                            <Route path="offline" element={<Offline />} />
                            <Route path="offline/:offlineId" element={<OfflineDetail />} />

                            <Route path="online" element={<Online />} />
                            <Route path="online/:onlineId" element={<OnlineDetail />} />
                        </Route>

                        <Route path="/rooms" element={<RoomList />} />
                        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                        <Route path="/reservations/my" element={<MyReservationPage />} />
                        {/* <Route path="/room/:roomId" element={<RoomReserve />} /> */}
                        <Route path="/approveOrganization" element={<PrivateRoute><ApproveOrganization /></PrivateRoute>}/>
                    </Route>
                </Routes>
            </SSEProvider>
        </Provider>
    )
}

export default CommonRouter;

