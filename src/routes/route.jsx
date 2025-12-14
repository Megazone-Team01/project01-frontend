import {Routes, Route} from "react-router";
import MainLayout from "@/components/layout/MainLayout.jsx";
import Home from "@/domains/home/page/Home.jsx";
import Sign from "@/domains/user/page/Sign.jsx";
import Offline from "@/domains/lecture/offline/page/Offline.jsx";
import OfflineDetail from "@/domains/lecture/offline/page/OfflineDetail.jsx";
import Online from "@/domains/lecture/online/page/Online.jsx";
import OnlineDetail from "@/domains/lecture/online/page/OnlineDetail.jsx";

function CommonRouter(){
    return  (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home />}/>
                <Route path="/lecture">
                    <Route path="offline" element={<Offline />}/>
                    <Route path="offlineId/:offlineId" element={<OfflineDetail />} />

                    <Route path="online" element={<Online />}/>
                    <Route path="online/:onlineId" element={<OnlineDetail />} />
                </Route>

                <Route path="/sign" element={<Sign />}/>
            </Route>
        </Routes>
    )
}

export default CommonRouter;