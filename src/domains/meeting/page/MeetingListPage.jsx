import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getTeachersByOrganization, getMyMeetings } from "@/domains/meeting/api/meetingApi";
import TeacherCard from '@/components/common/TeacherCard.jsx';

function MeetingListPage() {
    const { id } = useParams(); // 여기서 id는 기관 ID
    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                const data = await getTeachersByOrganization(1);
                setTeachers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTeachers();
        }
    }, [id]);

    const handleTeacherClick = (teacherId) => {
        navigate(`/organization/${id}/meetings/${teacherId}`);
    };

    if (loading) return <div className="p-4">로딩 중...</div>;
    if (error) return <div className="p-4 text-red-500">에러: {error}</div>;

    return (
        <div className="p-6">
            {/* 상단 안내 영역 */}
            <div className="flex gap-8 mb-8">
                <div className="w-64 h-48 bg-gray-100 rounded-lg" />
                <div>
                    <h1 className="text-2xl font-bold mb-4">상담 유의사항 안내</h1>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p>• 같은 선생님과의 상담은 하루에 1번만 가능합니다.</p>
                        <p>• 상담은 1시간 진행됩니다.</p>
                        <p>• 상담 예약 이후 취소를 원하시는 경우, 고객센터로 연락 부탁드립니다.</p>
                        <p>• 예약 확정은 수동으로 확인되며, 마이페이지에서 예약 여부를 확인할 수 있습니다.</p>
                    </div>
                </div>
            </div>

            {/* 선생님 목록 */}
            <h2 className="text-xl font-semibold mb-4">선생님 선택</h2>
            {teachers.length === 0 ? (
                <p className="text-gray-500">등록된 선생님이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teachers.map((teacher) => (
                        <TeacherCard
                            key={teacher.teacherId}
                            teacher={teacher}
                            onClick={() => handleTeacherClick(teacher.teacherId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MeetingListPage;