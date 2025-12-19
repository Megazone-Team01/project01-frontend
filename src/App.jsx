import './App.css'
import CommonRouter from "@/routes/route.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "@/auth";
import { getNewAccessToken } from "@/auth"; // 새 AccessToken 발급 API
import { useSelector } from "react-redux";

function App() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("현재 Redux 상태:", auth);
        if (refreshToken) {
            getNewAccessToken(refreshToken)
            .then((res) => {
                if (res.accessToken) {
                    dispatch(refreshAccessToken({ accessToken: res.accessToken }));
                }
            })
            .catch(() => {
                localStorage.removeItem("refreshToken"); // 실패 시 삭제
            });
        }
    }, [dispatch]);

    return <CommonRouter />;
}

export default App;