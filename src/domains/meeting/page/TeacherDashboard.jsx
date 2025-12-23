import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Video,
    MapPin,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    History,
    Users,
    Building2,
    Settings,
    Menu,
    X,
    Link as LinkIcon,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, startOfDay, isToday, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import axiosInstance from '@/common/api/axiosInstance';

// API 함수들
const teacherApi = {
    getTeacherMeetings: async () => {
        const response = await axiosInstance.get('/v1/meetings/teacher/my');
        return response.data;
    },
    approveMeeting: async (meetingId, isOnline, location = null) => {
        const response = await axiosInstance.patch(
            `/v1/meetings/${meetingId}/approve?isOnline=${isOnline}`,
            { location },
            // { params: { isOnline } }
        );
        return response.data;
    },
    rejectMeeting: async (meetingId, isOnline, reason) => {
        const response = await axiosInstance.patch(
            `/v1/meetings/${meetingId}/reject`,
            { reason },
            { params: { isOnline } }
        );
        return response.data;
    },
};

// 사이드 메뉴 아이템
const MENU_ITEMS = [
    { id: 'meetings', label: '상담 관리', icon: Users, path: '/teacher/dashboard' },
    { id: 'organization', label: '기관 승인', icon: Building2, path: '/teacher/organization' },
    { id: 'settings', label: '설정', icon: Settings, path: '/teacher/settings' },
];

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

// 승인 모달
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
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">상담 승인</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
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
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || (meeting.isOnline && !location.trim())}
                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle2 size={18} />승인</>}
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
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-red-600">상담 반려</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-sm text-red-600 font-medium">반려 시 학생에게 사유가 전달됩니다.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">반려 사유 (필수)</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="반려 사유를 입력해주세요..."
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason.trim()}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><XCircle size={18} />반려</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 상담 카드 컴포넌트
const MeetingCard = ({ meeting, onApprove, onReject, compact = false }) => {
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const formatTime = (dateTime) => format(new Date(dateTime), 'HH:mm');
    const isPending = meeting.status === 0;

    if (compact) {
        return (
            <div className={`flex items-center gap-4 p-4 rounded-xl ${isPending ? 'bg-yellow-50 border border-yellow-200' : 'bg-slate-50'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${meeting.isOnline ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                    {meeting.isOnline ? <Video size={18} /> : <MapPin size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{meeting.name}</p>
                    <p className="text-sm text-slate-500">
                        {format(new Date(meeting.startAt), 'M월 d일 HH:mm')}
                    </p>
                </div>
                <StatusBadge status={meeting.status} statusName={meeting.statusName} />
                {isPending && (
                    <div className="flex gap-1">
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                        >
                            <XCircle size={16} />
                        </button>
                        <button
                            onClick={() => setShowApproveModal(true)}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                        >
                            <CheckCircle2 size={16} />
                        </button>
                    </div>
                )}

                {showApproveModal && <ApproveModal meeting={meeting} onClose={() => setShowApproveModal(false)} onApprove={onApprove} />}
                {showRejectModal && <RejectModal meeting={meeting} onClose={() => setShowRejectModal(false)} onReject={onReject} />}
            </div>
        );
    }

    return (
        <>
            <div className={`bg-white rounded-2xl border-2 p-5 transition-all ${isPending ? 'border-yellow-300 shadow-lg shadow-yellow-50' : 'border-slate-200 hover:shadow-md'
                }`}>
                {isPending && (
                    <div className="flex items-center gap-2 text-yellow-600 text-sm font-bold mb-3">
                        <AlertCircle size={16} className="animate-pulse" />
                        승인 대기중
                    </div>
                )}

                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meeting.isOnline ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {meeting.isOnline ? <Video size={22} /> : <MapPin size={22} />}
                        </div>
                        <div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meeting.isOnline ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                {meeting.isOnline ? '온라인' : '오프라인'}
                            </span>
                            <h3 className="font-bold text-lg text-slate-900 mt-1">{meeting.name}</h3>
                        </div>
                    </div>
                    <StatusBadge status={meeting.status} statusName={meeting.statusName} />
                </div>

                <div className="space-y-2 mb-4 p-3 bg-slate-50 rounded-xl text-sm">
                    <div className="flex items-center gap-2">
                        <Clock size={15} className="text-slate-400" />
                        <span className="text-slate-600">{formatTime(meeting.startAt)} - {formatTime(meeting.endAt)}</span>
                    </div>
                    {meeting.location && (
                        <div className="flex items-center gap-2">
                            <LinkIcon size={15} className="text-slate-400" />
                            <span className="text-slate-600 truncate">{meeting.location}</span>
                        </div>
                    )}
                </div>

                {isPending ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                        >
                            <XCircle size={16} />반려
                        </button>
                        <button
                            onClick={() => setShowApproveModal(true)}
                            className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={16} />승인
                        </button>
                    </div>
                ) : meeting.status === 1 && meeting.isOnline && meeting.location && (
                    <a
                        href={meeting.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm text-center"
                    >
                        <Video size={16} className="inline mr-2" />상담 입장
                    </a>
                )}
            </div>

            {showApproveModal && <ApproveModal meeting={meeting} onClose={() => setShowApproveModal(false)} onApprove={onApprove} />}
            {showRejectModal && <RejectModal meeting={meeting} onClose={() => setShowRejectModal(false)} onReject={onReject} />}
        </>
    );
};

// 사이드바 컴포넌트
const Sidebar = ({ activeMenu, onMenuClick }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* 모바일 메뉴 버튼 */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center"
            >
                <Menu size={24} />
            </button>

            {/* 모바일 오버레이 */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">메뉴</h2>
                            <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <nav className="space-y-1">
                            {MENU_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onMenuClick(item.id);
                                        setIsMobileOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeMenu === item.id
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* 데스크톱 사이드바 */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-6 bg-white rounded-2xl border border-slate-200 p-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">강사 메뉴</h2>
                    <nav className="space-y-1">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onMenuClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeMenu === item.id
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
};

// 메인 컴포넌트
const TeacherDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeMenu, setActiveMenu] = useState('meetings');
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPastMeetings, setShowPastMeetings] = useState(false);

    // 상담 목록 조회
    const fetchMeetings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await teacherApi.getTeacherMeetings();
            console.log('=== API 응답 확인 ===');
            console.log('전체:', data);
            if (data?.[0]) {
                console.log('첫 번째 항목:', data[0]);
                console.log('online:', data[0].online);
                console.log('isOnline:', data[0].isOnline);
            }
            setMeetings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('상담 목록 조회 실패:', err);
            if (err.response?.status === 404) {
                setMeetings([]);
            } else {
                setError('상담 목록을 불러오지 못했습니다.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeMenu === 'meetings') {
            fetchMeetings();
        }
    }, [activeMenu, fetchMeetings]);

    // 승인/반려 처리
    const handleApprove = async (meetingId, isOnline, meetingLocation) => {
        await teacherApi.approveMeeting(meetingId, isOnline, meetingLocation);
        fetchMeetings();
    };

    const handleReject = async (meetingId, isOnline, reason) => {
        await teacherApi.rejectMeeting(meetingId, isOnline, reason);
        fetchMeetings();
    };

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
        // 실제 라우팅이 필요하면 아래 주석 해제
        // const item = MENU_ITEMS.find(m => m.id === menuId);
        // if (item) navigate(item.path);
    };

    // 날짜별 분류
    const today = startOfDay(new Date());
    const selectedDateMeetings = meetings.filter(m => isSameDay(new Date(m.startAt), selectedDate));
    const pendingMeetings = meetings.filter(m => m.status === 0);
    const upcomingMeetings = meetings.filter(m => {
        const meetingDate = startOfDay(new Date(m.startAt));
        return !isBefore(meetingDate, today) && !isSameDay(meetingDate, selectedDate);
    });
    const pastMeetings = meetings.filter(m => isBefore(startOfDay(new Date(m.startAt)), today));

    const meetingDates = meetings.map(m => startOfDay(new Date(m.startAt)));
    const hasEventOnDate = (date) => meetingDates.some(d => isSameDay(d, date));

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <span>마이페이지</span>
                        <ChevronRight size={14} />
                        <span className="text-slate-600">강사 대시보드</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">강사 대시보드</h1>
                            <p className="text-slate-500">상담 요청을 관리하고 일정을 확인하세요.</p>
                        </div>
                        {pendingMeetings.length > 0 && (
                            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse">
                                <AlertCircle size={18} />
                                {pendingMeetings.length}건 승인 대기
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* 사이드바 */}
                    <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

                    {/* 메인 콘텐츠 */}
                    <main className="flex-1 min-w-0">
                        {activeMenu === 'meetings' && (
                            <>
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                                        <p className="text-slate-400">불러오는 중...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                                        <XCircle size={48} className="mx-auto mb-4 text-red-400" />
                                        <p className="text-slate-500 mb-4">{error}</p>
                                        <button onClick={fetchMeetings} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">
                                            다시 시도
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* 캘린더 - 상단 */}
                                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={(date) => date && setSelectedDate(date)}
                                                locale={ko}
                                                disabled={(date) => {
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);
                                                    return date < today;
                                                }}
                                                className="rounded-2xl border border-slate-200 shadow-sm p-4 w-full [&_table]:w-full"
                                                classNames={{
                                                    months: "flex flex-col w-full",
                                                    month: "space-y-4 w-full",
                                                    caption: "flex justify-between items-center px-2 mb-4",
                                                    caption_label: "text-xl font-bold",
                                                    nav: "flex items-center gap-2",
                                                    nav_button: "h-9 w-9 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors",
                                                    nav_button_previous: "",
                                                    nav_button_next: "",
                                                    table: "w-full border-collapse",
                                                    head_row: "flex w-full",
                                                    head_cell: "text-slate-600 font-bold text-base flex-1 text-center py-3",
                                                    row: "flex w-full mt-2",
                                                    cell: "flex-1 text-center p-0 relative",
                                                    day: "w-full aspect-square flex items-center justify-center rounded-xl text-base font-semibold hover:bg-slate-100 cursor-pointer",
                                                    day_selected: "bg-indigo-500 text-white hover:bg-indigo-600",
                                                    day_today: "bg-slate-200 text-slate-900 font-bold",
                                                    day_outside: "text-slate-300",
                                                    day_disabled: "text-slate-300 opacity-50 cursor-not-allowed hover:bg-transparent",
                                                }}
                                            />

                                        </div>

                                        {/* 상담 목록 */}
                                        <div className="space-y-6">
                                            {/* 대기중인 요청 (항상 표시) */}
                                            {pendingMeetings.length > 0 && (
                                                <div>
                                                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                        <AlertCircle size={20} className="text-yellow-500" />
                                                        승인 대기중
                                                        <span className="text-sm bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                                                            {pendingMeetings.length}건
                                                        </span>
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {pendingMeetings.map((meeting, index) => (
                                                            <MeetingCard
                                                                key={`pending-${meeting.meetingId}-${index}`}
                                                                meeting={{
                                                                    ...meeting,
                                                                    isOnline: meeting.online ?? meeting.isOnline ?? false
                                                                }}
                                                                onApprove={handleApprove}
                                                                onReject={handleReject}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* 선택된 날짜 */}
                                            <div>
                                                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <CalendarIcon size={20} className="text-blue-500" />
                                                    {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
                                                    {isToday(selectedDate) && (
                                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">오늘</span>
                                                    )}
                                                </h2>

                                                {selectedDateMeetings.filter(m => m.status !== 0).length === 0 ? (
                                                    <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                                        <CalendarIcon size={36} className="mx-auto mb-2 text-slate-300" />
                                                        <p className="text-slate-400">이 날짜에 확정된 상담이 없습니다</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {selectedDateMeetings.filter(m => m.status !== 0).map((meeting, index) => (
                                                            <MeetingCard
                                                                key={`selected-${meeting.meetingId}-${index}`}
                                                                meeting={{
                                                                    ...meeting,
                                                                    isOnline: meeting.online ?? meeting.isOnline ?? false
                                                                }}
                                                                onApprove={handleApprove}
                                                                onReject={handleReject}
                                                                compact
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 지난 내역 토글 */}
                                            {pastMeetings.length > 0 && (
                                                <div>
                                                    <button
                                                        onClick={() => setShowPastMeetings(!showPastMeetings)}
                                                        className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <History size={20} className="text-slate-500" />
                                                            <span className="font-bold text-slate-700">지난 상담 내역</span>
                                                            <span className="text-sm text-slate-400">({pastMeetings.length}건)</span>
                                                        </div>
                                                        {showPastMeetings ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                                    </button>

                                                    {showPastMeetings && (
                                                        <div className="mt-3 space-y-2">
                                                            {pastMeetings.map((meeting, index) => (
                                                                <MeetingCard
                                                                    key={`past-${meeting.meetingId}-${index}`}
                                                                    meeting={{
                                                                        ...meeting,
                                                                        isOnline: meeting.online ?? meeting.isOnline ?? false
                                                                    }}
                                                                    onApprove={handleApprove}
                                                                    onReject={handleReject}
                                                                    compact
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {meetings.length === 0 && (
                                                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                                    <Users size={48} className="mx-auto mb-4 text-slate-300" />
                                                    <p className="text-slate-400 font-bold text-lg">받은 상담 요청이 없습니다</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeMenu === 'organization' && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                                <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
                                <p className="text-slate-400 font-bold text-lg">기관 승인 기능 준비중</p>
                                <p className="text-slate-400 text-sm mt-2">곧 사용할 수 있습니다.</p>
                            </div>
                        )}

                        {activeMenu === 'settings' && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                                <Settings size={48} className="mx-auto mb-4 text-slate-300" />
                                <p className="text-slate-400 font-bold text-lg">설정 기능 준비중</p>
                                <p className="text-slate-400 text-sm mt-2">곧 사용할 수 있습니다.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;