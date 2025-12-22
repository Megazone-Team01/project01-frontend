
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
    Video,
    ArrowRight,
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTeachers } from '@/domains/meeting/hook/useTeachers';
import { getTeacherDetail, createdMeeting } from '@/domains/meeting/api/meetingApi';
// TODO: 회의실 브랜치에서 주석 해제
// import { useRooms } from '@/domains/room/hook/useRooms';


// 상담 카테고리 (백엔드에서 가져오거나 상수로 관리)
// TODO: 필요시 백엔드 Category API에서 조회
const MEETING_CATEGORIES = [
    { code: 'CAREER', name: '진로 상담' },
    { code: 'STUDY', name: '학습 상담' },
    { code: 'LIFE', name: '생활 상담' },
    { code: 'OTHER', name: '기타 상담' },
];


const OrganizationServiceSection = ({ organizationId }) => {

    const [activeTab, setActiveTab] = useState('meeting');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [step, setStep] = useState('select');

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookingType, setBookingType] = useState('ONLINE');
    const [selectedCategory, setSelectedCategory] = useState(null); // 상담 카테고리 추가
    const [isSubmitting, setIsSubmitting] = useState(false);


    const { teachers, loading: teachersLoading, error } = useTeachers(organizationId);

    // TODO: 회의실 브랜치에서 주석 해제
    // const { rooms, loading: roomsLoading } = useRooms(organizationId);
    const rooms = [];
    const roomsLoading = false;

    const [timeSlots, setTimeSlots] = useState([]);

    // 날짜나 선택된 선생님이 변경될 때마다 가능한 시간 조회
    useEffect(() => {
        const fetchTimes = async () => {
            if (selectedItem && selectedDate) {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const teacherId = selectedItem.teacherId || selectedItem.id;
                try {
                    const response = await getAvailableTimes(teacherId, dateStr);
                    const mappedSlots = response.timeSlots.map(slot => ({
                        time: slot.time,
                        status: slot.available ? 'available' : 'booked'
                    }));
                    setTimeSlots(mappedSlots);
                } catch (err) {
                    console.error("시간대 조회 실패", err);
                } finally {
                    setTimeSlotsLoading(false);
                }
            }
        };
        fetchTimes();
    }, [selectedDate, selectedItem]);

    // 팝업 핸들러
    const handleOpenModal = async (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
        setStep('select');
        setSelectedTime(null);
        setSelectedDate(new Date());
        setBookingType('ONLINE');
        setSelectedCategory(null);

        if (activeTab === 'meeting') {
            const detail = await getTeacherDetail(item.teacherId);
            setSelectedItem(prev => ({ ...prev, ...detail }));
        };
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setSelectedTime(null);
        setSelectedCategory(null);
        setTimeSlots([]);
    };


    const handleConfirm = async () => {
        if (!selectedTime || !selectedCategory || isSubmitting) return;

        try {
            setIsSubmitting(true);

            const startHour = parseInt(selectedTime.split(':')[0]);

            const reservationData = {
                isOnline: bookingType === 'ONLINE',
                name: selectedCategory.name,
                organizationId: organizationId,
                teacherId: selectedItem?.teacherId || selectedItem?.id,
                dateTime: `${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`,
                isOnline: bookingType === 'ONLINE',
                location: bookingType === 'ONLINE' ? null : "오프라인 상담실",
                roomId: bookingType === 'OFFLINE' ? null : null, // 오프라인일떄 roomId 추가 가능
            };
            await createMeeting(reservationData);
            setStep('success');
        } catch (error) {
            console.error('상담 예약 실패:', error);
            alert(error.response?.data?.message || '상담 예약에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        };
    }

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

    const formatDate = (date) => {
        return format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko });
    };

    // 예약 버튼 활성화 조건
    const canSubmit = selectedTime && selectedCategory && !isSubmitting;


    return (
        <section className="w-full bg-slate-50 border-t border-slate-200">
            <div className="relative overflow-hidden w-full min-h-[900px]">
                <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">

                    {/* 헤더 */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">이용 가능한 서비스</h2>
                            <p className="text-slate-500 text-lg font-medium italic">
                                원하는 서비스를 선택하여 일정을 예약하세요
                            </p>
                        </div>

                        <div className="flex bg-slate-200/60 p-1.5 rounded-3xl w-fit shadow-inner border-slate-200">
                            <button
                                onClick={() => setActiveTab('meeting')}
                                className={`flex items-center gap-2.5 px-8 py-3 rounded-3xl text-lg font-black transition-all
                                ${activeTab === 'meeting' ? 'bg-white text-gray-600 shadow-xl scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <UserCheck size={25} />
                                <span>멘토 강사 상담</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('room')}
                                className={`flex items-center gap-2.5 px-10 py-4 rounded-3xl text-xl font-black transition-all
                                ${activeTab === 'room' ? 'bg-white text-gray-600 shadow-lg scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Monitor size={26} />
                                <span>스터디룸</span>
                            </button>
                        </div>
                    </div>

                    {/* 카드 그리드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeTab === 'meeting' ? (
                            teachersLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-64 bg-slate-100 rounded-[40px] animate-pulse" />
                                ))
                            ) : teachers.length === 0 ? (
                                <div className="col-span-full text-center py-32 bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                                    <UserCheck size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-slate-400 font-bold">등록된 상담 전문가가 없습니다.</p>
                                </div>
                            ) : (
                                teachers.map(teacher => (
                                    <TeacherCard
                                        key={teacher.teacherId || teacher.id}
                                        teacher={teacher}
                                        onClick={() => handleOpenModal(teacher)}
                                    />
                                ))
                            )
                        ) : (
                            <div className="col-span-full text-center py-32 bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                                <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-slate-400 font-bold">스터디룸 기능은 현재 준비 중입니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 예약 팝업 모달 */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-500"
                            onClick={handleCloseModal}
                        />

                        <div className="relative bg-white w-full max-w-3xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col md:flex-row max-h-[95vh]">

                            {/* 좌측 정보 바 */}
                            <div className={`hidden md:flex flex-col justify-between p-12 w-80 text-white ${activeTab === 'meeting' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                                <div className="space-y-8">
                                    <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                                        {activeTab === 'meeting' ? <UserCheck size={32} /> : <Monitor size={32} />}
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm font-bold mb-2">예약 대상</p>
                                        <h3 className="text-2xl font-black">{selectedItem?.name}</h3>
                                        <p className="text-white/80 mt-1">{selectedItem?.subject || '상담 전문'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm">
                                    {selectedCategory && (
                                        <div className="flex items-center gap-3">
                                            <Tag size={18} className="opacity-60" />
                                            <span>{selectedCategory.name}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon size={18} className="opacity-60" />
                                        <span>{formatDate(selectedDate)}</span>
                                    </div>
                                    {selectedTime && (
                                        <div className="flex items-center gap-3">
                                            <Clock size={18} className="opacity-60" />
                                            <span>{selectedTime} (1시간)</span>
                                        </div>
                                    )}
                                    {activeTab === 'meeting' && (
                                        <div className="flex items-center gap-3">
                                            <Video size={18} className="opacity-60" />
                                            <span>{bookingType === 'ONLINE' ? '화상 상담' : '대면 상담'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 우측 폼 영역 */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between p-8 border-b border-slate-100">
                                    <h4 className="text-xl font-black text-slate-900">Schedule</h4>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-3 hover:bg-slate-100 rounded-full text-slate-300 transition-colors"
                                    >
                                        <X size={28} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto px-10 py-10 space-y-10 custom-scrollbar">
                                    {step === 'select' ? (
                                        <>
                                            {/* 1. 상담 유형 선택 (카테고리) */}
                                            {activeTab === 'meeting' && (
                                                <div className="space-y-4">
                                                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Tag size={14} className="text-blue-500" /> 01. 상담 유형 선택
                                                    </h5>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {MEETING_CATEGORIES.map(category => (
                                                            <button
                                                                key={category.code}
                                                                onClick={() => setSelectedCategory(category)}
                                                                className={`py-3 px-4 rounded-2xl border-2 text-sm font-bold transition-all
                                                                ${selectedCategory?.code === category.code
                                                                        ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-50'
                                                                        : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                                            >
                                                                {category.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2. 상담 방식 선택 */}
                                            {activeTab === 'meeting' && (
                                                <div className="space-y-4">
                                                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Video size={14} className="text-blue-500" /> 02. 상담 방식 선택
                                                    </h5>
                                                    <div className="flex gap-4">
                                                        {['ONLINE', 'OFFLINE'].map(mode => (
                                                            <button
                                                                key={mode}
                                                                onClick={() => setBookingType(mode)}
                                                                className={`flex-1 py-4 rounded-[20px] border-2 text-sm font-black transition-all
                                                                ${bookingType === mode
                                                                        ? 'border-slate-900 bg-slate-900 text-white shadow-xl'
                                                                        : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                                            >
                                                                {mode === 'ONLINE' ? '화상(Zoom)' : '대면(현장)'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* 3. 날짜 선택 - Shadcn Calendar */}
                                            <div className="space-y-4">
                                                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <CalendarIcon size={14} className="text-blue-500" /> 03. 날짜 선택
                                                </h5>

                                                <div className="flex justify-center">
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                setSelectedDate(date);
                                                                setSelectedTime(null);
                                                            }
                                                        }}
                                                        locale={ko}
                                                        disabled={(date) => {
                                                            const today = new Date();
                                                            today.setHours(0, 0, 0, 0);
                                                            return date < today;
                                                        }}
                                                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                                        classNames={{
                                                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                                            month: "space-y-4",
                                                            caption: "flex justify-center pt-1 relative items-center",
                                                            caption_label: "text-sm font-bold",
                                                            nav: "space-x-1 flex items-center",
                                                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-slate-200 rounded-lg transition-all",
                                                            nav_button_previous: "absolute left-1",
                                                            nav_button_next: "absolute right-1",
                                                            table: "w-full border-collapse space-y-1",
                                                            head_row: "flex",
                                                            head_cell: "text-slate-400 rounded-md w-9 font-bold text-[0.8rem]",
                                                            row: "flex w-full mt-2",
                                                            cell: "h-9 w-9 text-center text-sm p-0 relative",
                                                            day: "h-9 w-9 p-0 font-medium rounded-xl hover:bg-slate-200 transition-all",
                                                            day_selected: "bg-slate-900 text-white hover:bg-slate-800 font-bold",
                                                            day_today: "bg-blue-100 text-blue-900 font-bold",
                                                            day_outside: "text-slate-300 opacity-50",
                                                            day_disabled: "text-slate-300 opacity-30 cursor-not-allowed",
                                                            day_hidden: "invisible",
                                                        }}
                                                    />
                                                </div>

                                                {selectedDate && (
                                                    <div className="text-center text-sm text-slate-600 bg-white rounded-xl py-3 border border-slate-100">
                                                        선택: <span className="font-bold text-slate-900">
                                                            {formatDate(selectedDate)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 4. 시간 선택 */}
                                            <div className="space-y-4">
                                                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Clock size={14} className="text-blue-500" /> 04. 시작 시간 (1시간 단위)
                                                </h5>
                                                {timeSlotsLoading ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {Array.from({ length: 8 }).map((_, i) => (
                                                            <div key={i} className="h-14 bg-slate-100 rounded-[20px] animate-pulse" />
                                                        ))}
                                                    </div>
                                                ) : timeSlots.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl">
                                                        선택한 날짜에 예약 가능한 시간이 없습니다.
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {timeSlots.map(slot => (
                                                            <button
                                                                key={slot.time}
                                                                disabled={slot.status === 'booked'}
                                                                onClick={() => setSelectedTime(slot.time)}
                                                                className={`py-4 rounded-[20px] border-2 text-xs font-black transition-all 
                                                                ${slot.status === 'booked'
                                                                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                                                                        : selectedTime === slot.time
                                                                            ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-50'
                                                                            : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                                                            >
                                                                {slot.time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        /* 예약 완료 화면 */
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20 animate-in zoom-in-95 duration-700">
                                            <div className="relative">
                                                <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner relative">
                                                    <CheckCircle2 size={56} />
                                                    <div className="absolute -inset-4 bg-emerald-100 rounded-full -z-10 animate-ping opacity-20" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Success!</h3>
                                                <p className="text-slate-400 font-bold text-base leading-relaxed">
                                                    <span className="text-slate-700">{selectedCategory?.name}</span> 상담 신청이 완료되었습니다.<br />
                                                    선생님 확인 후 승인 알림이 발송됩니다.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 푸터 버튼 */}
                                <div className="p-10 border-t border-slate-50 bg-slate-50/50 mt-auto">
                                    {step === 'select' ? (
                                        <button
                                            disabled={!canSubmit}
                                            onClick={handleConfirm}
                                            className="w-full py-6 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-[28px] font-black text-xl transition-all active:scale-95 shadow-2xl"
                                        >
                                            {isSubmitting
                                                ? '예약 중...'
                                                : !selectedCategory
                                                    ? '상담 유형을 선택해 주세요'
                                                    : !selectedTime
                                                        ? '시간을 선택해 주세요'
                                                        : `${selectedTime}에 예약하기`}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCloseModal}
                                            className="w-full py-6 bg-white border-2 border-slate-900 text-slate-900 rounded-[28px] font-black text-xl hover:bg-slate-50 transition-all shadow-md"
                                        >
                                            확인했습니다
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                `}</style>
            </div>
        </section>
    );
};

// ========== 선생님 카드 UI 컴포넌트 ==========
const TeacherCard = ({ teacher, onClick }) => (
    <div
        onClick={onClick}
        className="group relative bg-white border border-slate-200 rounded-[40px] p-8 transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between min-h-[280px] overflow-hidden"
    >
        <div className="flex justify-between items-start mb-6 z-10">
            <div className="relative">
                <img
                    src={teacher.profileImage || `https://i.pravatar.cc/150?u=${teacher.teacherId || teacher.id}`}
                    alt={teacher.name}

                    className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-50 shadow-md group-hover:ring-blue-50 transition-all"
                />
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
                {Array.isArray(teacher.tags) && teacher.tags.length > 0 ? (
                    teacher.tags.map((tag) => (
                        <Badge key={tag} className="text-[12px] font-bold px-3 py-1.5 rounded-fullbg-slate-200 text-slate-700">{tag}</Badge>
                    ))) : (
                    <div className="px-5 py-2.5 rounded-full bg-blue-100 text-blue-700 text-sm font-extrabold tracking-wide shadow-sm">상담가능</div>
                )}
            </div>
        </div>
        <div className="z-10">
            <h3 className="text-2xl font-black mb-1 group-hover:text-blue-600 transition-colors leading-tight">{teacher.name}
                <span> </span>
                <span className="font-black font-black">강사</span>
            </h3>
            <p className="text-sm text-slate-400 font-bold mt-2 leading-relaxed">{teacher.subject || "상담 전문"}</p>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-8 z-10">
            <span className="text-slate-400 flex items-center gap-2 font-bold text-[17px] uppercase tracking-widest leading-none">
                <Clock size={20} className="text-blue-500" /> 1시간
            </span>
            <div className="w-12 h-12 rounded-full  bg-slate-200/70 text-slate-900 flex items-center justify-center group-hover:scale-110 transition-all shadow-xl">
                <ArrowRight size={20} />
            </div>
        </div>
        {/* 배경 데코레이션 */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors" />
    </div>
);

export default OrganizationServiceSection;