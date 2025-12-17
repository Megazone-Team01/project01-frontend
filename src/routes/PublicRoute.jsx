import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // 로그인 상태면 홈으로 리다이렉트
    if (isAuthenticated){
        return <Navigate to="/" replace />;
    }

    return children;
}