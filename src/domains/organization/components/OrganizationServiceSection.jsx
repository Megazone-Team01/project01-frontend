
import { useState } from 'react';
import {
    Users,
    Clock,
    Calendar as CalendarIcon,
    X,
    CheckCircle2,
    Info,
    MapPin,
    ChevronRight,
    Monitor,
    UserCheck,
    Video
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useTeachers } from '@/domains/meeting/hook/useTeachers';
// TODO: 회의실 브랜치에서 주석 해제
// import { useRooms } from '@/domains/room/hook/useRooms';

const OrganizationServiceSection = ({ organizationId }) => {

    const [activeTab, setActiveTab] = useState('meeting');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [step, setStep] = useState('select');

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookingType, setBookingType] = useState('ONLINE');

    const { teachers, loading: teachersLoading } = useTeachers(organizationId);

    // TODO: 회의실 브랜치에서 주석 해제
    // const { rooms, loading: roomsLoading } = useRooms(organizationId);
    const rooms = [];
    const roomsLoading = false;

    // TODO: API 연동 필요
    const timeSlots = [
        { time: '09:00', status: 'available' },
        { time: '10:00', status: 'available' },
        { time: '11:00', status: 'booked' },
        { time: '14:00', status: 'available' },
        { time: '15:00', status: 'available' },
        { time: '16:00', status: 'booked' },
        { time: '17:00', status: 'available' },
    ];

    // 이벤트 핸들러
    const handleOpenDrawer = (item) => {
        setSelectedItem(item);
        setIsDrawerOpen(true);
        setStep('select');
        setSelectedTime(null);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedItem(null);
    };

    // TODO: API 연동 필요
    const handleConfirm = () => {
        if (!selectedTime) return;
        console.log('예약 데이터:', {
            itemId: selectedItem?.id,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            type: bookingType,
        });
        setStep('success');
    };

    // 날짜 생성
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const dates = generateDates();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    const formatDate = (date) => {
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    return (
        <section className="w-full bg-slate-50 border-t border-slate-200">
            <div className="relative overflow-hidden w-full min-h-[900px]">
                <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">

                    {/* 헤더 + 탭 */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                이용 가능한 서비스
                            </h2>
                            <p className="text-slate-500 text-lg">
                                원하는 서비스를 선택하여 일정을 예약하세요.
                            </p>
                        </div>

                        {/* 탭 토글 */}
                        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-fit shadow-inner">
                            <button
                                onClick={() => { setActiveTab('meeting'); closeDrawer(); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
                                    ${activeTab === 'meeting'
                                        ? 'bg-white text-blue-600 shadow-lg'
                                        : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <UserCheck size={18} /> 전문가 상담
                            </button>
                            {/* TODO: 회의실 브랜치에서 주석 해제 */}
                            {/*
                            <button
                                onClick={() => { setActiveTab('room'); closeDrawer(); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
                                    ${activeTab === 'room'
                                        ? 'bg-white text-indigo-600 shadow-lg'
                                        : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Monitor size={18} /> 스터디룸
                            </button>
                            */}
                        </div>
                    </div>

                    {/* 카드 그리드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === 'meeting' ? (
                            // 상담 탭
                            teachersLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-56 bg-slate-100 rounded-3xl animate-pulse" />
                                ))
                            ) : teachers.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-slate-400">
                                    <UserCheck size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>등록된 상담 선생님이 없습니다.</p>
                                </div>
                            ) : (
                                teachers.map(teacher => (
                                    <TeacherCard
                                        key={teacher.id}
                                        teacher={teacher}
                                        onClick={() => handleOpenDrawer(teacher)}
                                    />
                                ))
                            )
                        ) : (
                            // TODO: 회의실 브랜치에서 실제 로직으로 교체
                            // 현재는 빈 상태만 표시
                            <div className="col-span-full text-center py-20 text-slate-400">
                                <Monitor size={48} className="mx-auto mb-4 opacity-50" />
                                <p>스터디룸 기능 준비 중입니다.</p>
                            </div>
                            /* 회의실 브랜치에서 아래 코드로 교체:
                            roomsLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
                                ))
                            ) : rooms.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-slate-400">
                                    <Monitor size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>등록된 스터디룸이 없습니다.</p>
                                </div>
                            ) : (
                                rooms.map(room => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        onClick={() => handleOpenDrawer(room)}
                                    />
                                ))
                            )
                            */
                        )}
                    </div>
                </div>

                {/* drawer 오버레이 */}
                {isDrawerOpen && (
                    <div
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] z-20 
                            transition-opacity duration-300"
                        onClick={closeDrawer}
                    />
                )}

                {/* drawer 패널 */}
                <div
                    className={`absolute top-0 right-0 h-full bg-white z-30 
                        shadow-[-20px_0_60px_rgba(0,0,0,0.08)] 
                        transition-transform duration-500 ease-out
                        w-full sm:w-[500px] flex flex-col border-l border-slate-100
                        ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    {selectedItem && (
                        <>
                            {/* drawer 헤더 */}
                            <div className="px-8 py-8 flex items-center justify-between border-b border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg
                                        ${activeTab === 'meeting' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                                        {activeTab === 'meeting' ? <Users size={24} /> : <MapPin size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900">{selectedItem.name}</h4>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                                            {activeTab === 'meeting' ? '상담 예약' : '공간 예약'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeDrawer}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-slate-400" />
                                </button>
                            </div>

                            {/* drawer 본문 */}
                            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
                                {step === 'select' ? (
                                    <>
                                        {/* 선택된 대상 정보 */}
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                            <img
                                                src={selectedItem.profileImage || `https://i.pravatar.cc/150?u=${selectedItem.id}`}
                                                className="w-14 h-14 rounded-xl object-cover"
                                                alt=""
                                            />
                                            <div>
                                                <h5 className="font-bold text-slate-900">{selectedItem.name}</h5>
                                                <p className="text-sm text-slate-500">
                                                    {selectedItem.subject || selectedItem.location || '전문 상담'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 상담 방식 선택 (상담 탭일 때만) */}
                                        {activeTab === 'meeting' && (
                                            <div className="space-y-4">
                                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Info size={14} /> 1. 상담 방식
                                                </h5>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => setBookingType('ONLINE')}
                                                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-semibold transition-all
                                                            ${bookingType === 'ONLINE'
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                                                    >
                                                        <Video size={18} /> 온라인
                                                    </button>
                                                    <button
                                                        onClick={() => setBookingType('OFFLINE')}
                                                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-semibold transition-all
                                                            ${bookingType === 'OFFLINE'
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                                                    >
                                                        <MapPin size={18} /> 오프라인
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 날짜 선택 */}
                                        <div className="space-y-4">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <CalendarIcon size={14} />
                                                {activeTab === 'meeting' ? '2' : '1'}. 날짜 선택
                                            </h5>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div className="grid grid-cols-7 gap-1 mb-2">
                                                    {weekDays.map(d => (
                                                        <div key={d} className="text-center text-[10px] text-slate-400 font-bold py-1">
                                                            {d}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-7 gap-1">
                                                    {dates.map((date, i) => {
                                                        const isSelected = date.toDateString() === selectedDate.toDateString();
                                                        const isToday = date.toDateString() === new Date().toDateString();
                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => {
                                                                    setSelectedDate(date);
                                                                    setSelectedTime(null);
                                                                }}
                                                                className={`aspect-square rounded-xl text-sm font-semibold transition-all
                                                                    ${isSelected
                                                                        ? 'bg-slate-900 text-white shadow-lg'
                                                                        : isToday
                                                                            ? 'bg-blue-100 text-blue-700'
                                                                            : 'hover:bg-white text-slate-600'}`}
                                                            >
                                                                {date.getDate()}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 시간 선택 */}
                                        <div className="space-y-4">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Clock size={14} />
                                                {activeTab === 'meeting' ? '3' : '2'}. 시간 선택 (1시간)
                                            </h5>
                                            <div className="grid grid-cols-3 gap-3">
                                                {timeSlots.map(slot => (
                                                    <button
                                                        key={slot.time}
                                                        disabled={slot.status === 'booked'}
                                                        onClick={() => setSelectedTime(slot.time)}
                                                        className={`py-4 rounded-xl text-sm font-bold transition-all
                                                            ${slot.status === 'booked'
                                                                ? 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                                                                : selectedTime === slot.time
                                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                                    : 'bg-white border-2 border-slate-100 hover:border-blue-300 text-slate-600'
                                                            }`}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 안내 문구 */}
                                        <div className="p-4 bg-slate-900 rounded-2xl flex items-start gap-3 text-white">
                                            <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                                            <p className="text-xs leading-relaxed opacity-80">
                                                {activeTab === 'meeting'
                                                    ? '같은 선생님과의 상담은 하루 1회만 가능합니다. 신청 후 승인 여부가 안내됩니다.'
                                                    : '스터디룸은 최대 3시간까지 연속 예약 가능합니다.'}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    /* 완료 화면 */
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                                        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full 
                                            flex items-center justify-center">
                                            <CheckCircle2 size={56} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">신청 완료!</h3>
                                            <p className="text-slate-500">
                                                {formatDate(selectedDate)} {selectedTime}<br />
                                                {activeTab === 'meeting'
                                                    ? '승인 후 안내 문자가 발송됩니다.'
                                                    : '예약이 확정되었습니다.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 드로어 푸터 */}
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                                {step === 'select' ? (
                                    <button
                                        disabled={!selectedTime}
                                        onClick={handleConfirm}
                                        className={`w-full py-5 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]
                                            ${selectedTime
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                    >
                                        {selectedTime ? `${selectedTime} 신청하기` : '시간을 선택해 주세요'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={closeDrawer}
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg 
                                            hover:bg-slate-800 transition-all"
                                    >
                                        확인했습니다
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </section>
    );
};

// ========== 선생님 카드 ==========
const TeacherCard = ({ teacher, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm 
            hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="relative">
                <img
                    src={teacher.profileImage || `https://i.pravatar.cc/150?u=${teacher.id}`}
                    className="w-16 h-16 rounded-2xl object-cover"
                    alt={teacher.name}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100">
                상담가능
            </Badge>
        </div>
        <div className="mb-6">
            <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {teacher.name}
            </h4>
            <p className="text-sm text-slate-400 font-medium mt-1">
                {teacher.subject || '전문 상담'}
            </p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={14} /> 1시간 단위
            </span>
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center 
                group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronRight size={18} />
            </div>
        </div>
    </div>
);

// ========== 회의실 카드 (회의실 브랜치에서 사용) ==========
// TODO: 회의실 브랜치에서 주석 해제
/*
const RoomCard = ({ room, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm 
            hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group"
    >
        <div className="h-36 overflow-hidden relative bg-slate-200">
            <img
                src={room.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={room.name}
            />
            <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/90 text-slate-700">
                    {room.location}
                </Badge>
            </div>
        </div>
        <div className="p-5">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {room.name}
                </h4>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Users size={14} /> {room.maxNum || room.capacity}인
                </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-xs text-slate-400">즉시 이용 가능</span>
                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center 
                    group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                </div>
            </div>
        </div>
    </div>
);
*/

export default OrganizationServiceSection;