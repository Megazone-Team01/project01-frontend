import { useState, useEffect, useCallback } from 'react';
import { getMyMeetings, cancelMeeting } from '../api/meetingApi';

export const useMyMeetings = (initialType = 'ALL', initialStatus = null) => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [type, setType] = useState(initialType);
    const [status, setStatus] = useState(initialStatus);

    const fetchMeetings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getMyMeetings(type, status);
            const data = Array.isArray(response) ? response : [];
            setMeetings(data);
        } catch (err) {
            console.error('상담 목록 조회 실패:', err);

            if (err.response?.status === 401) {
                setError('로그인이 필요합니다.');
            } else if (err.response?.status === 403) {
                setError('접근 권한이 없습니다.');
            } else {
                setError('상담 목록을 불러오지 못했습니다.');
            }
        } finally {
            setLoading(false);
        }
    }, [type, status]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    // 상담 취소 함수
    const handleCancelMeeting = async (meetingId, isOnline) => {
        try {
            await cancelMeeting(meetingId, isOnline);
            // 성공 시 목록 새로고침
            await fetchMeetings();
            return { success: true };
        } catch (err) {
            console.error('상담 취소 실패:', err);
            const errorMessage = err.response?.data?.message || '상담 취소에 실패했습니다.';
            return { success: false, error: errorMessage };
        }
    };

    // 필터 변경 함수
    const changeFilter = (newType, newStatus) => {
        if (newType !== undefined) setType(newType);
        if (newStatus !== undefined) setStatus(newStatus);
    };

    return {
        meetings,
        loading,
        error,
        type,
        status,
        refetch: fetchMeetings,
        cancelMeeting: handleCancelMeeting,
        changeFilter
    };
};