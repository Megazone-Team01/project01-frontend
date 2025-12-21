
import { useState, useEffect, useCallback } from 'react';
import { getTeachersByOrganization } from '../api/meetingApi';

export const useTeachers = (organizationId) => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTeachers = useCallback(async () => {
        if (!organizationId) { return; }

        try {
            setLoading(true);
            setError(null);
            const response = await getTeachersByOrganization(organizationId);
            const data = Array.isArray(response) ? response : [];
            setTeachers(data);
        } catch (err) {
            console.error('선생님 목록 조회 실패:', err);

            if (err.response?.status === 403) {
                setError('접근 권한이 없습니다. 로그인 상태를 확인해주세요.');
            } else if (err.response?.status === 404) {
                setError('해당 기관의 선생님을 찾을 수 없습니다.');
            } else {
                setError('선생님 목록을 불러오지 못했습니다.');
            }
        } finally {
            setLoading(false);
        }
    }, [organizationId]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);



    return { teachers, loading, error, refetch: fetchTeachers };
};