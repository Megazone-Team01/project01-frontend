import { useState, useEffect } from "react";
import { getPendingJoinRequests, updateJoinStatus } from "../api/approveOrganization.js";

export const useApproveOrganizationForm = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 승인 대기 요청 조회
    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const data = await getPendingJoinRequests();
            setPendingRequests(data);
        } catch (err) {
            setError(err.response?.data?.message || "승인 대기 요청 조회 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 승인/거절 처리
    const handleUpdateStatus = async (requestId, status) => {
        try {
            setLoading(true);
            await updateJoinStatus(requestId, status);
            await fetchPendingRequests(); // 상태 업데이트 후 리스트 갱신
        } catch (err) {
            // 서버 메시지 확인 후 없으면 기본 메시지 사용
            const message = err.response?.data?.message || "상태 업데이트 중 오류가 발생했습니다.";
            setError(message);       // state 업데이트
            window.alert(message);   // 팝업
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    return { pendingRequests, loading, error, handleUpdateStatus };
};
