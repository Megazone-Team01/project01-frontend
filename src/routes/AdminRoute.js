import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // 인증되지 않았거나 ADMIN 권한이 없는 경우
    if (!isAuthenticated || user?.role !== 'ADMIN') {
        alert("관리자만 접근할 수 있습니다");
        // eslint-disable-next-line react-hooks/immutability
        window.location.href="/";
        return null
    }

    return children;
}