
import { useState, useEffect } from 'react';
import { getTeachersByOrganization } from '../api/meetingApi';

export const useTeachers = (organizationId) => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!organizationId) {
            setLoading(false);
            return;
        }

        const fetchTeachers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getTeachersByOrganization(organizationId);
                setTeachers(data || []);
            } catch (err) {
                console.error('선생님 목록 조회 실패:', err);
                setError(err);
                setTeachers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [organizationId]);

    return { teachers, loading, error };
};