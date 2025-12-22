import { useState, useEffect, useCallback } from 'react';
import {
    Calendar,
    Clock,
    User,
    Video,
    MapPin,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Filter,
    RefreshCw,
    ChevronRight,
    X,
    Link as LinkIcon,
    Send,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import axiosInstance from '@/common/api/axiosInstance';

// API 함수들
const teacherMeetingApi = {
    // 강사에게 온 상담 요청 목록 조회
    // TODO: 백엔드 API 완성 후 엔드포인트 수정
    getTeacherMeetings: async (type = 'ALL', status = null) => {
        const response = await axiosInstance.get('/v1/meetings/teacher/my', {
            params: { type, status }
        });
        return response.data;
    },

    // 상담 승인
    approveMeeting: async (meetingId, isOnline, location = null) => {
        const response = await axiosInstance.patch(
            `/v1/meetings/${meetingId}/approve`,
            { location },
            { params: { isOnline } }
        );
        return response.data;
    },

    // 상담 반려
    rejectMeeting: async (meetingId, isOnline, reason) => {
        const response = await axiosInstance.patch(
            `/v1/meetings/${meetingId}/reject`,
            { reason },
            { params: { isOnline } }
        );
        return response.data;
    },
};

// 상태 배지 컴포넌트
const StatusBadge = ({ status, statusName }) => {
    const config = {
        '-1': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
        '0': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: AlertCircle },
        '1': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle2 },
        '2': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: CheckCircle2 },
    };

    const { bg, text, border, icon: Icon } = config[String(status)] || config['0'];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${bg} ${text} ${border}`}>
            <Icon size={14} />
            {statusName}
        </span>
    );
};

// 승인 모달 (온라인 상담 - Zoom 링크 입력)
const ApproveModal = ({ meeting, onClose, onApprove }) => {
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (meeting.isOnline && !location.trim()) {
            alert('화상 회의 링크를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onApprove(meeting.meetingId, meeting.isOnline, meeting.isOnline ? location : null);
            onClose();
        } catch (err) {
            alert('승인에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">상담 승인</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-500">학생</p>
                        <p className="font-bold">{meeting.studentName || '학생'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-500">상담 유형</p>
                        <p className="font-bold">{meeting.name}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-500">일시</p>
                        <p className="font-bold">
                            {format(new Date(meeting.startAt), 'yyyy년 M월 d일 (EEE) HH:mm', { locale: ko })}
                        </p>
                    </div>

                    {meeting.isOnline && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                <LinkIcon size={14} className="inline mr-1" />
                                화상 회의 링크 (필수)
                            </label>
                            <input
                                type="url"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="https://zoom.us/j/..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <p className="text-xs text-slate-400 mt-2">
                                Zoom, Google Meet 등의 링크를 입력해주세요.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || (meeting.isOnline && !location.trim())}
                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <CheckCircle2 size={18} />
                                승인하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 반려 모달
const RejectModal = ({ meeting, onClose, onReject }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            alert('반려 사유를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onReject(meeting.meetingId, meeting.isOnline, reason);
            onClose();
        } catch (err) {
            alert('반려에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-red-600">상담 반려</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-sm text-red-600 font-medium">
                            반려 시 학생에게 사유가 전달됩니다.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            반려 사유 (필수)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="반려 사유를 입력해주세요..."
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason.trim()}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <XCircle size={18} />
                                반려하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 상담 요청 카드 컴포넌트
const MeetingRequestCard = ({ meeting, onApprove, onReject }) => {
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const formatDateTime = (dateTime) => {
        return format(new Date(dateTime), 'M월 d일 (EEE)', { locale: ko });
    };

    const formatTime = (dateTime) => {
        return format(new Date(dateTime), 'HH:mm');
    };

    // 대기 상태 여부
    const isPending = meeting.status === 0;

    return (
        <>
            <div className={`bg-white rounded-2xl border-2 p-6 transition-all ${isPending
                ? 'border-yellow-300 shadow-lg shadow-yellow-100'
                : 'border-slate-200 hover:shadow-md'
                }`}>
                {/* 대기중 라벨 */}
                {isPending && (
                    <div className="flex items-center gap-2 text-yellow-600 text-sm font-bold mb-4 animate-pulse">
                        <AlertCircle size={16} />
                        승인 대기중
                    </div>
                )}

                {/* 헤더 */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${meeting.isOnline
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-orange-100 text-orange-600'
                            }`}>
                            {meeting.isOnline ? <Video size={24} /> : <MapPin size={24} />}
                        </div>
                        <div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meeting.isOnline
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-orange-50 text-orange-600'
                                }`}>
                                {meeting.isOnline ? '온라인' : '오프라인'}
                            </span>
                            <h3 className="font-bold text-lg text-slate-900 mt-1">{meeting.name}</h3>
                        </div>
                    </div>
                    <StatusBadge status={meeting.status} statusName={meeting.statusName} />
                </div>

                {/* 상담 정보 */}
                <div className="space-y-3 mb-5 p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3 text-sm">
                        <User size={16} className="text-slate-400" />
                        <span className="text-slate-900 font-bold">{meeting.studentName || '학생'}</span>
                        <span className="text-slate-400">님의 요청</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-slate-600">{formatDateTime(meeting.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-slate-600">
                            {formatTime(meeting.startAt)} - {formatTime(meeting.endAt)}
                        </span>
                    </div>
                    {meeting.location && (
                        <div className="flex items-center gap-3 text-sm">
                            {meeting.isOnline ? <LinkIcon size={16} className="text-slate-400" /> : <MapPin size={16} className="text-slate-400" />}
                            <span className="text-slate-600 truncate">{meeting.location}</span>
                        </div>
                    )}
                </div>

                {/* 액션 버튼 */}
                {isPending ? (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <XCircle size={16} />
                            반려
                        </button>
                        <button
                            onClick={() => setShowApproveModal(true)}
                            className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            승인
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {/* 승인된 온라인 상담 */}
                        {meeting.status === 1 && meeting.isOnline && meeting.location && (
                            <a
                                href={meeting.location}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2"
                            >
                                <Video size={16} />
                                상담 입장
                            </a>
                        )}

                        {/* 승인된 오프라인 상담 */}
                        {meeting.status === 1 && !meeting.isOnline && (
                            <div className="flex-1 py-3 px-4 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2">
                                <MapPin size={16} />
                                {meeting.location || '장소 미정'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 모달들 */}
            {showApproveModal && (
                <ApproveModal
                    meeting={meeting}
                    onClose={() => setShowApproveModal(false)}
                    onApprove={onApprove}
                />
            )}
            {showRejectModal && (
                <RejectModal
                    meeting={meeting}
                    onClose={() => setShowRejectModal(false)}
                    onReject={onReject}
                />
            )}
        </>
    );
};

// 메인 페이지 컴포넌트
const TeacherMeetingManagement = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [type, setType] = useState('ALL');
    const [status, setStatus] = useState(null);

    // 상담 목록 조회
    const fetchMeetings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await teacherMeetingApi.getTeacherMeetings(type, status);
            setMeetings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('상담 목록 조회 실패:', err);
            if (err.response?.status === 404) {
                // API가 아직 없는 경우 빈 배열로 처리
                setMeetings([]);
            } else {
                setError('상담 목록을 불러오는데 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    }, [type, status]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    // 승인 처리
    const handleApprove = async (meetingId, isOnline, location) => {
        await teacherMeetingApi.approveMeeting(meetingId, isOnline, location);
        fetchMeetings();
    };

    // 반려 처리
    const handleReject = async (meetingId, isOnline, reason) => {
        await teacherMeetingApi.rejectMeeting(meetingId, isOnline, reason);
        fetchMeetings();
    };

    // 대기중인 요청 수
    const pendingCount = meetings.filter(m => m.status === 0).length;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <span>마이페이지</span>
                        <ChevronRight size={14} />
                        <span className="text-slate-600">상담 관리</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">
                                상담 요청 관리
                            </h1>
                            <p className="text-slate-500">
                                학생들의 상담 요청을 확인하고 승인/반려하세요.
                            </p>
                        </div>
                        {pendingCount > 0 && (
                            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                                <AlertCircle size={18} />
                                {pendingCount}건의 대기중인 요청
                            </div>
                        )}
                    </div>
                </div>

                {/* 필터 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-600">필터:</span>
                        </div>

                        {/* 타입 필터 */}
                        <div className="flex gap-2">
                            {[
                                { value: 'ALL', label: '전체' },
                                { value: 'ONLINE', label: '온라인' },
                                { value: 'OFFLINE', label: '오프라인' },
                            ].map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setType(value)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${type === value
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="w-px h-6 bg-slate-200 hidden md:block" />

                        {/* 상태 필터 */}
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { value: null, label: '전체 상태' },
                                { value: 0, label: '대기' },
                                { value: 1, label: '승인' },
                                { value: -1, label: '반려' },
                                { value: 2, label: '완료' },
                            ].map(({ value, label }) => (
                                <button
                                    key={String(value)}
                                    onClick={() => setStatus(value)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${status === value
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* 새로고침 */}
                        <button
                            onClick={fetchMeetings}
                            disabled={loading}
                            className="ml-auto p-2.5 hover:bg-slate-100 rounded-xl transition-all"
                            title="새로고침"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin text-blue-500' : 'text-slate-400'} />
                        </button>
                    </div>
                </div>

                {/* 상담 목록 */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                        <p className="text-slate-400">불러오는 중...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                        <XCircle size={48} className="mx-auto mb-4 text-red-400" />
                        <p className="text-slate-500 mb-4">{error}</p>
                        <button
                            onClick={fetchMeetings}
                            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : meetings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-400 font-bold text-lg mb-2">받은 상담 요청이 없습니다</p>
                        <p className="text-slate-400 text-sm">학생들의 상담 요청이 여기에 표시됩니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 대기중인 요청을 먼저 표시 */}
                        {meetings
                            .sort((a, b) => {
                                // 대기중(0)인 것을 먼저
                                if (a.status === 0 && b.status !== 0) return -1;
                                if (a.status !== 0 && b.status === 0) return 1;
                                // 나머지는 날짜순
                                return new Date(b.startAt) - new Date(a.startAt);
                            })
                            .map((meeting) => (
                                <MeetingRequestCard
                                    key={`${meeting.isOnline ? 'online' : 'offline'}-${meeting.meetingId}`}
                                    meeting={meeting}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherMeetingManagement;