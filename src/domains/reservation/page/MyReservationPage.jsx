// =====================================================
// /src/domains/reservation/page/MyReservationPage.jsx
// 학생용 통합 예약 대시보드 (상담 + 회의실)
// =====================================================

import { useState, useEffect, useCallback } from 'react';
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
    DoorOpen,
    Menu,
    X,
    Building2,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, startOfDay, isToday, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getMyMeetings, cancelMeeting } from '@/domains/meeting/api/meetingApi';
import { getMyReservations, cancelReservation } from '@/domains/reservation/api/reservationApi';

// 사이드 메뉴 아이템
const MENU_ITEMS = [
    { id: 'meetings', label: '상담 예약', icon: Users },
    { id: 'rooms', label: '회의실 예약', icon: DoorOpen },
];

// ==================== 상담 관련 컴포넌트 ====================

const MeetingStatusBadge = ({ status, statusName }) => {
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

const MeetingCard = ({ meeting, onCancel, compact = false }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const isOnline = meeting.online ?? meeting.isOnline ?? false;

    const formatTime = (dateTime) => format(new Date(dateTime), 'HH:mm');

    const handleCancel = async () => {
        if (!confirm('정말 이 상담을 취소하시겠습니까?')) return;
        setIsProcessing(true);
        try {
            await onCancel(meeting.meetingId, isOnline);
        } finally {
            setIsProcessing(false);
        }
    };

    if (compact) {
        return (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${meeting.isOnline ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                    {meeting.isOnline ? <Video size={18} /> : <MapPin size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{meeting.name}</p>
                    <p className="text-sm text-slate-500">
                        {format(new Date(meeting.startAt), 'M월 d일')} · {meeting.teacherName} 강사
                    </p>
                </div>
                <MeetingStatusBadge status={meeting.status} statusName={meeting.statusName} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all">
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
                <MeetingStatusBadge status={meeting.status} statusName={meeting.statusName} />
            </div>

            <div className="space-y-2 mb-4 p-3 bg-slate-50 rounded-xl text-sm">
                <div className="flex items-center gap-2">
                    <User size={15} className="text-slate-400" />
                    <span className="text-slate-600">{meeting.teacherName} 강사</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={15} className="text-slate-400" />
                    <span className="text-slate-600">{formatTime(meeting.startAt)} - {formatTime(meeting.endAt)}</span>
                </div>
                {meeting.location && (
                    <div className="flex items-center gap-2">
                        {meeting.isOnline ? <Video size={15} className="text-slate-400" /> : <MapPin size={15} className="text-slate-400" />}
                        <span className="text-slate-600 truncate">{meeting.location}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {meeting.status === 0 && (
                    <button
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="animate-spin mx-auto" size={18} /> : '예약 취소'}
                    </button>
                )}

                {meeting.status === 1 && meeting.isOnline && meeting.location && (
                    <a
                        href={meeting.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2"
                    >
                        <Video size={16} />
                        화상 상담 입장
                    </a>
                )}
            </div>
        </div>
    );
};

// ==================== 회의실 예약 관련 컴포넌트 ====================

const ReservationCard = ({ reservation, onCancel, compact = false }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const formatTime = (dateTime) => format(new Date(dateTime), 'HH:mm');
    const isPast = isBefore(new Date(reservation.startAt), new Date());

    const handleCancel = async () => {
        if (!confirm('정말 이 예약을 취소하시겠습니까?')) return;
        setIsProcessing(true);
        try {
            await onCancel(reservation.reservationId);
        } finally {
            setIsProcessing(false);
        }
    };

    if (compact) {
        return (
            <div className={`flex items-center gap-4 p-4 rounded-xl ${isPast ? 'bg-slate-100' : 'bg-indigo-50'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isPast ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                    <DoorOpen size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{reservation.roomName}</p>
                    <p className="text-sm text-slate-500">
                        {format(new Date(reservation.startAt), 'M월 d일')} · {formatTime(reservation.startAt)} - {formatTime(reservation.endAt)}
                    </p>
                </div>
                {!isPast && (
                    <button
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl border-2 p-5 transition-all ${isPast ? 'border-slate-200 opacity-70' : 'border-indigo-200 hover:shadow-lg'
            }`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isPast ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                        <DoorOpen size={22} />
                    </div>
                    <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPast ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                            {isPast ? '이용 완료' : '예약됨'}
                        </span>
                        <h3 className="font-bold text-lg text-slate-900 mt-1">{reservation.roomName}</h3>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-4 p-3 bg-slate-50 rounded-xl text-sm">
                <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-slate-400" />
                    <span className="text-slate-600">{reservation.organizationName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-slate-400" />
                    <span className="text-slate-600">{reservation.roomLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={15} className="text-slate-400" />
                    <span className="text-slate-600">
                        {format(new Date(reservation.startAt), 'M월 d일 (EEE)', { locale: ko })} {formatTime(reservation.startAt)} - {formatTime(reservation.endAt)}
                    </span>
                </div>
            </div>

            {!isPast && (
                <button
                    onClick={handleCancel}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                >
                    {isProcessing ? <Loader2 className="animate-spin mx-auto" size={18} /> : '예약 취소'}
                </button>
            )}
        </div>
    );
};

// ==================== 사이드바 ====================

const Sidebar = ({ activeMenu, onMenuClick }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center"
            >
                <Menu size={24} />
            </button>

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
                                    onClick={() => { onMenuClick(item.id); setIsMobileOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeMenu === item.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
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

            <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-6 bg-white rounded-2xl border border-slate-200 p-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">내 예약</h2>
                    <nav className="space-y-1">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onMenuClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeMenu === item.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
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

// ==================== 메인 페이지 ====================

const MyReservationPage = () => {
    const [activeMenu, setActiveMenu] = useState('meetings');

    // 상담 관련 state
    const [meetings, setMeetings] = useState([]);
    const [meetingsLoading, setMeetingsLoading] = useState(true);
    const [meetingsError, setMeetingsError] = useState(null);

    // 회의실 예약 관련 state
    const [reservations, setReservations] = useState([]);
    const [reservationsLoading, setReservationsLoading] = useState(true);
    const [reservationsError, setReservationsError] = useState(null);

    // 공통 state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPast, setShowPast] = useState(false);

    // 상담 목록 조회
    const fetchMeetings = useCallback(async () => {
        setMeetingsLoading(true);
        setMeetingsError(null);
        try {
            const data = await getMyMeetings('ALL', null);
            setMeetings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('상담 목록 조회 실패:', err);
            setMeetingsError('상담 목록을 불러오지 못했습니다.');
        } finally {
            setMeetingsLoading(false);
        }
    }, []);

    // 회의실 예약 목록 조회
    const fetchReservations = useCallback(async () => {
        setReservationsLoading(true);
        setReservationsError(null);
        try {
            const data = await getMyReservations(true); // 과거 포함
            setReservations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('회의실 예약 조회 실패:', err);
            setReservationsError('회의실 예약을 불러오지 못했습니다.');
        } finally {
            setReservationsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeMenu === 'meetings') {
            fetchMeetings();
        } else if (activeMenu === 'rooms') {
            fetchReservations();
        }
    }, [activeMenu, fetchMeetings, fetchReservations]);

    // 상담 취소
    const handleMeetingCancel = async (meetingId, isOnline) => {
        try {
            await cancelMeeting(meetingId, isOnline);
            fetchMeetings();
        } catch (err) {
            alert(err.response?.data?.message || '상담 취소에 실패했습니다.');
        }
    };

    // 회의실 예약 취소
    const handleReservationCancel = async (reservationId) => {
        try {
            await cancelReservation(reservationId);
            fetchReservations();
        } catch (err) {
            alert(err.response?.data?.message || '예약 취소에 실패했습니다.');
        }
    };

    // 날짜별 분류 헬퍼
    const today = startOfDay(new Date());

    const getDateFilteredItems = (items, dateField = 'startAt') => {
        const selectedDateItems = items.filter(item => isSameDay(new Date(item[dateField]), selectedDate));
        const upcomingItems = items.filter(item => {
            const itemDate = startOfDay(new Date(item[dateField]));
            return !isBefore(itemDate, today) && !isSameDay(itemDate, selectedDate);
        });
        const pastItems = items.filter(item => isBefore(startOfDay(new Date(item[dateField])), today));

        return { selectedDateItems, upcomingItems, pastItems };
    };

    // 캘린더 이벤트 표시
    const allDates = activeMenu === 'meetings'
        ? meetings.map(m => startOfDay(new Date(m.startAt)))
        : reservations.map(r => startOfDay(new Date(r.startAt)));

    const hasEventOnDate = (date) => allDates.some(d => isSameDay(d, date));

    // 현재 데이터
    const currentData = activeMenu === 'meetings' ? meetings : reservations;
    const { selectedDateItems, upcomingItems, pastItems } = getDateFilteredItems(currentData);
    const loading = activeMenu === 'meetings' ? meetingsLoading : reservationsLoading;
    const error = activeMenu === 'meetings' ? meetingsError : reservationsError;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <span>마이페이지</span>
                        <ChevronRight size={14} />
                        <span className="text-slate-600">내 예약</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">내 예약 관리</h1>
                    <p className="text-slate-500">상담 및 회의실 예약 내역을 확인하고 관리하세요.</p>
                </div>

                <div className="flex gap-8">
                    <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

                    <main className="flex-1 min-w-0">
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
                                    onClick={activeMenu === 'meetings' ? fetchMeetings : fetchReservations}
                                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold"
                                >
                                    다시 시도
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* 캘린더 */}
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
                                            row: "flex w-full",
                                            cell: "flex-1 text-center p-1",
                                            day: "w-full aspect-square flex items-center justify-center rounded-xl text-base font-semibold hover:bg-slate-100 cursor-pointer",
                                            day_selected: "bg-blue-500 text-white hover:bg-blue-600",
                                            day_today: "bg-slate-200 text-slate-900 font-bold",
                                            day_outside: "text-slate-300",
                                            day_disabled: "text-slate-300 opacity-50 cursor-not-allowed hover:bg-transparent",
                                        }}
                                    />
                                </div>

                                {/* 선택된 날짜 */}
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <CalendarIcon size={20} className={activeMenu === 'meetings' ? 'text-blue-500' : 'text-indigo-500'} />
                                        {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
                                        {isToday(selectedDate) && (
                                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">오늘</span>
                                        )}
                                    </h2>

                                    {selectedDateItems.length === 0 ? (
                                        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                            {activeMenu === 'meetings' ? <Users size={40} className="mx-auto mb-3 text-slate-300" /> : <DoorOpen size={40} className="mx-auto mb-3 text-slate-300" />}
                                            <p className="text-slate-400 font-medium">
                                                이 날짜에 {activeMenu === 'meetings' ? '예약된 상담이' : '예약된 회의실이'} 없습니다
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {activeMenu === 'meetings'
                                                ? selectedDateItems.map((meeting) => (
                                                    <MeetingCard
                                                        key={`meeting-${meeting.isOnline ? 'online' : 'offline'}-${meeting.meetingId}-${meeting.startAt}`}
                                                        meeting={meeting}
                                                        onCancel={handleMeetingCancel}
                                                    />
                                                ))
                                                : selectedDateItems.map((reservation) => (
                                                    <ReservationCard
                                                        key={reservation.reservationId}
                                                        reservation={reservation}
                                                        onCancel={handleReservationCancel}
                                                    />
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>

                                {/* 예정된 항목 */}
                                {upcomingItems.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Clock size={20} className="text-green-500" />
                                            예정된 {activeMenu === 'meetings' ? '상담' : '예약'}
                                            <span className="text-sm font-normal text-slate-400">({upcomingItems.length}건)</span>
                                        </h2>
                                        <div className="space-y-2">
                                            {upcomingItems.slice(0, 5).map((item) =>
                                                activeMenu === 'meetings' ? (
                                                    <MeetingCard
                                                        key={`upcoming-meeting-${item.isOnline ? 'online' : 'offline'}-${item.meetingId}-${item.startAt}`}
                                                        meeting={item}
                                                        onCancel={handleMeetingCancel}
                                                        compact
                                                    />
                                                ) : (
                                                    <ReservationCard
                                                        key={item.reservationId}
                                                        reservation={item}
                                                        onCancel={handleReservationCancel}
                                                        compact
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 지난 항목 토글 */}
                                {pastItems.length > 0 && (
                                    <div>
                                        <button
                                            onClick={() => setShowPast(!showPast)}
                                            className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <History size={20} className="text-slate-500" />
                                                <span className="font-bold text-slate-700">지난 {activeMenu === 'meetings' ? '상담' : '예약'} 내역</span>
                                                <span className="text-sm text-slate-400">({pastItems.length}건)</span>
                                            </div>
                                            {showPast ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                        </button>

                                        {showPast && (
                                            <div className="mt-3 space-y-2">
                                                {pastItems.map((item) =>
                                                    activeMenu === 'meetings' ? (
                                                        <MeetingCard
                                                            key={`past-meeting-${item.isOnline ? 'online' : 'offline'}-${item.meetingId}-${item.startAt}`}
                                                            meeting={item}
                                                            onCancel={handleMeetingCancel}
                                                            compact
                                                        />
                                                    ) : (
                                                        <ReservationCard
                                                            key={item.reservationId}
                                                            reservation={item}
                                                            onCancel={handleReservationCancel}
                                                            compact
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 데이터 없을 때 */}
                                {currentData.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                        {activeMenu === 'meetings' ? <Users size={48} className="mx-auto mb-4 text-slate-300" /> : <DoorOpen size={48} className="mx-auto mb-4 text-slate-300" />}
                                        <p className="text-slate-400 font-bold text-lg mb-2">
                                            {activeMenu === 'meetings' ? '예약된 상담이 없습니다' : '예약된 회의실이 없습니다'}
                                        </p>
                                        <p className="text-slate-400 text-sm">기관 페이지에서 예약해보세요!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyReservationPage;
