
import { useEffect, useState } from 'react';
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
    ArrowRight, BookAIcon, User2Icon, ImageIcon,
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTeachers } from '@/domains/meeting/hook/useTeachers';
import { getTeacherDetail, getAvailableTimes, createMeeting } from '@/domains/meeting/api/meetingApi';
import { getOrganizationLecture, getOrganizationTeacher } from "@/domains/organization/api/organizationApi.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Label } from "@/components/ui/label.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableRooms } from '@/domains/room/api/roomApi';
import { createReservation } from '@/domains/reservation/api/reservationApi';
import { useSelector } from 'react-redux';


const MEETING_CATEGORIES = [
    { code: 'CAREER', name: '진로 상담' },
    { code: 'STUDY', name: '학습 상담' },
    { code: 'LIFE', name: '생활 상담' },
    { code: 'OTHER', name: '기타 상담' },
];


const OrganizationServiceSection = ({ organizationId }) => {

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const userType = user?.type;

    const [activeTab, setActiveTab] = useState('meeting');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [step, setStep] = useState('select');

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookingType, setBookingType] = useState('ONLINE');
    const [selectedCategory, setSelectedCategory] = useState(null); // 상담 카테고리 추가
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);


    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomList, setRoomList] = useState([]);
    const [roomListLoading, setRoomListLoading] = useState(false);
    const [selectedRoomForReservation, setSelectedRoomForReservation] = useState(null);
    const [roomReservationDate, setRoomReservationDate] = useState(new Date());
    const [roomReservationStartTime, setRoomReservationStartTime] = useState(null);
    const [roomReservationEndTime, setRoomReservationEndTime] = useState(null);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [roomReservationSubmitting, setRoomReservationSubmitting] = useState(false);
    const [roomReservationStep, setRoomReservationStep] = useState('select');


    const [organizationTeachers, setOrganizationTeachers] = useState([]);
    const [organizationLectures, setOrganizationLectures] = useState([]);


    const { teachers, loading: teachersLoading, error } = useTeachers(organizationId);

    const [timeSlots, setTimeSlots] = useState([]);

    // 날짜나 선택된 선생님이 변경될 때마다 가능한 시간 조회
    useEffect(() => {
        const fetchTimes = async () => {
            if (selectedItem && selectedDate && activeTab === 2) {
                setTimeSlotsLoading(true);
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

    useEffect(() => {
        const fetchRooms = async () => {
            const needRooms = activeTab === 3 || (bookingType === 'OFFLINE' && isModalOpen);

            if (needRooms && organizationId) {
                setRoomListLoading(true);
                try {
                    const rooms = await getAvailableRooms(organizationId);
                    console.log('회의실 목록:', rooms);
                    setRoomList(rooms || []);
                } catch (err) {
                    console.error('회의실 목록 조회 실패:', err);
                    setRoomList([]);
                } finally {
                    setRoomListLoading(false);
                }
            }
        };
        fetchRooms();
    }, [activeTab, bookingType, organizationId, isModalOpen]);

    // 팝업 핸들러
    const handleOpenModal = async (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
        setStep('select');
        setSelectedTime(null);
        setSelectedDate(new Date());
        setBookingType('ONLINE');
        setSelectedCategory(null);

        if (activeTab === 2) {
            const detail = await getTeacherDetail(item.teacherId);
            setSelectedItem(prev => ({ ...prev, ...detail }));
        }
    };



    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setSelectedTime(null);
        setSelectedCategory(null);
        setSelectedRoom(null);
        setTimeSlots([]);
    };

    const handleOpenRoomModal = (room) => {
        setSelectedRoomForReservation(room);
        setIsRoomModalOpen(true);
        setRoomReservationDate(new Date());
        setRoomReservationStartTime(null);
        setRoomReservationEndTime(null);
    };

    const handleCloseRoomModal = () => {
        setIsRoomModalOpen(false);
        setSelectedRoomForReservation(null);
        setRoomReservationStartTime(null);
        setRoomReservationEndTime(null);
        setRoomReservationStep('select');
    };

    const handleRoomReservationConfirm = async () => {
        if (!roomReservationStartTime || !roomReservationEndTime || roomReservationSubmitting) return;

        try {
            setRoomReservationSubmitting(true);
            const dateStr = roomReservationDate.toISOString().split('T')[0];

            const reservationData = {
                roomId: selectedRoomForReservation.id,
                startAt: `${dateStr}T${roomReservationStartTime}:00`,
                endAt: `${dateStr}T${roomReservationEndTime}:00`,
            };


            await createReservation(reservationData);

            setRoomReservationStep('success');
        } catch (error) {
            console.error('회의실 예약 실패:', error);
            alert(error.response?.data?.message || '회의실 예약에 실패했습니다.');
        } finally {
            setRoomReservationSubmitting(false);
        }
    };

    // 시간 슬롯 생성
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
            slots.push(`${String(hour).padStart(2, '0')}:00`);
        }
        return slots;
    };
    const roomTimeSlots = generateTimeSlots();


    const handleConfirm = async () => {
        if (!selectedTime || !selectedCategory || isSubmitting) return;

        if (bookingType === 'OFFLINE' && !selectedRoom) {
            alert('회의실을 선택해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);

            const dateStr = selectedDate.toISOString().split('T')[0];
            const startHour = parseInt(selectedTime.split(':')[0]);
            const endHour = startHour + 1;

            const reservationData = {
                online: bookingType === 'ONLINE',
                name: selectedCategory.name,
                organizationId: parseInt(organizationId),
                teacherId: selectedItem?.teacherId || selectedItem?.id,
                startAt: `${dateStr}T${selectedTime}:00`,
                endAt: `${dateStr}T${String(endHour).padStart(2, '0')}:00:00`,
                location: bookingType === 'ONLINE' ? null : "오프라인 상담실",
                roomId: bookingType === 'OFFLINE' ? selectedRoom?.id : null,
            };


            console.log('bookingType:', bookingType);
            console.log('isOnline:', bookingType === 'ONLINE');
            console.log('예약 요청 데이터:', reservationData);
            await createMeeting(reservationData);
            setStep('success');
        } catch (error) {
            console.error('상담 예약 실패:', error);
            alert(error.response?.data?.message || '상담 예약에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };



    const formatDate = (date) => {
        return format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko });
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getOrganizationTeacher(organizationId);
            setOrganizationTeachers(data);

            const lecData = await getOrganizationLecture(organizationId);
            setOrganizationLectures(lecData);
        }
        fetchData()
    }, []);

    return (
        <section className="w-full bg-slate-50 border-t border-slate-200">
            <div className="relative overflow-hidden w-full min-h-[900px]">
                <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">이용 가능한 서비스</h2>
                            <p className="text-slate-500 text-sm font-medium italic">
                                원하는 서비스를 선택하여 일정을 예약하세요
                            </p>
                        </div>

                        <div className="flex bg-slate-200/60 p-1 rounded-3xl w-fit shadow-inner border-slate-200">
                            <button
                                onClick={() => setActiveTab(0)}
                                className={`flex items-center gap-2.5 px-8 py-2 rounded-3xl text-sm font-black transition-all
                                ${activeTab === 0 ? 'bg-white text-gray-600 shadow-xl scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <User2Icon size={25} />
                                <span> 강사 정보 </span>
                            </button>
                            <button
                                onClick={() => setActiveTab(1)}
                                className={`flex items-center gap-2.5 px-8 py-2 rounded-3xl text-sm font-black transition-all
                                ${activeTab === 1 ? 'bg-white text-gray-600 shadow-xl scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <BookAIcon size={25} />
                                <span> 강의 정보 </span>
                            </button>
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        alert('로그인이 필요합니다.');
                                        return;
                                    } setActiveTab(2)
                                }}
                                className={`flex items-center gap-2.5 px-8 py-2 rounded-3xl text-sm font-black transition-all
                                ${activeTab === 2 ? 'bg-white text-gray-600 shadow-xl scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <UserCheck size={25} />
                                <span>멘토 강사 상담</span>
                            </button>

                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        alert('로그인이 필요합니다.');
                                        return;
                                    }
                                    if (userType === 1) {
                                        alert('온라인 수강생은 회의실 예약이 불가합니다.');
                                        return;
                                    } setActiveTab(3)
                                }}
                                className={`flex items-center gap-2.5 px-10 py-2 rounded-3xl text-sm font-black transition-all
                                ${activeTab === 3 ? 'bg-white text-gray-600 shadow-lg scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Monitor size={26} />
                                <span>회의실</span>
                            </button>
                        </div>
                    </div>

                    {/* 카드 그리드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {
                            activeTab === 0 ? (
                                organizationTeachers.map((t, index) => (
                                    <Card>
                                        <CardContent>
                                            <div key={index} className="flex">
                                                <div className="flex flex-2 flex-col">
                                                    <CardTitle className="font-bold text-xl"> {t.userName} </CardTitle>
                                                    <CardDescription className="text-gray-400">
                                                        {t.organizationName}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex flex-1 flex-col">
                                                    {
                                                        t.url === null ?
                                                            <div
                                                                className="w-full min-h-36 flex justify-center items-center">
                                                                <ImageIcon size={25} />
                                                            </div>
                                                            :
                                                            <img
                                                                className="aspect-square"
                                                                src={`${import.meta.env.VITE_FILE_URL_HEADER}${t.url}`}
                                                                alt={t.url} />
                                                    }
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )
                                : activeTab === 1 ? (
                                    organizationLectures.map((l, index) => (
                                        <Card>
                                            <CardContent>
                                                <div key={index} className="flex flex-col">
                                                    <div className="flex flex-col">
                                                        {
                                                            l.thumbnail != null ?
                                                                <img
                                                                    className="object-contain max-w-full max-h-40"
                                                                    src={`${import.meta.env.VITE_FILE_URL_HEADER}${l.thumbnail}`}
                                                                    alt={l.thumbnail} />
                                                                :
                                                                <div className="w-full h-40 flex justify-center items-center">
                                                                    <ImageIcon size={25} />
                                                                </div>
                                                        }
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <CardTitle className="font-bold text-xl"> {l.name} </CardTitle>
                                                        <CardDescription className="text-gray-500 text-md">
                                                            {l.teacherName}
                                                        </CardDescription>
                                                        <CardDescription className="text-gray-400">
                                                            {
                                                                l.category.map((name, index) => (
                                                                    <span key={name}>
                                                                        {name}{index < l.category.length - 1 ? " > " : ""}
                                                                    </span>
                                                                ))
                                                            }
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )
                                    : activeTab === 2 ? (
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
                                    )
                                        : activeTab === 3 ? (
                                            roomListLoading ? (
                                                Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} className="h-64 bg-slate-100 rounded-[40px] animate-pulse" />
                                                ))
                                            ) : roomList.length === 0 ? (
                                                <div className="col-span-full text-center py-32 bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                                                    <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                                                    <p className="text-slate-400 font-bold">등록된 회의실이 없습니다.</p>
                                                </div>
                                            ) : (
                                                roomList.map(room => (
                                                    <RoomCard
                                                        key={room.id}
                                                        room={room}
                                                        onClick={() => handleOpenRoomModal(room)}
                                                    />
                                                ))
                                            )
                                        ) : null
                        }
                    </div>
                </div>


                {/* 예약 팝업 모달 */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* 오버레이 */}
                        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-500" onClick={handleCloseModal} />

                        {/* 모달 박스 */}
                        <div className="relative bg-white w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col md:flex-row max-h-[95vh]">

                            {/* 좌측 정보 바 */}
                            <div className={`hidden md:flex flex-col justify-between p-12 w-80 text-white ${activeTab === 2 ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                                <div className="space-y-8">
                                    <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                                        {activeTab === 2 ? <UserCheck size={32} /> : <Monitor size={32} />}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black leading-tight">{selectedItem?.name}</h3>
                                        {selectedItem?.email && (
                                            <p className="text-white/60 text-sm mt-2">{selectedItem.email}</p>
                                        )}
                                        <p className="text-white/70 font-bold mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                                            {activeTab === 2 ? '선택하신 강사님과의\n1:1 멘토링 상담 예약입니다.' : '효율적인 학습을 위한\n독립 공간 예약 서비스입니다.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4 border-t border-white/10 pt-10 font-black text-[15px] opacity-80 uppercase tracking-widest">
                                    <div className="flex items-center gap-3 text-blue-100"><CheckCircle2 size={20} /> 1시간 단위 </div>
                                    <div className="flex items-center gap-3 text-blue-100"><CheckCircle2 size={15} /> 관리자 문의 : 02-123-4567</div>
                                </div>
                            </div>

                            {/* 우측 조작 영역 */}
                            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                                {/* 헤더 (X 버튼만) */}
                                <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-end sticky top-0 bg-white z-10">
                                    <button onClick={handleCloseModal} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                        <X size={28} />
                                    </button>
                                </div>

                                {/* 컨텐츠 영역 */}
                                <div className="flex-1 overflow-y-auto px-10 py-10 space-y-10 custom-scrollbar">
                                    {step === 'select' ? (
                                        <>
                                            {/* 01. 상담 방식 선택 */}
                                            {activeTab === 2 && (
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                                                        <Video size={16} className="text-blue-500" /> 01. 상담 방식 선택
                                                    </h4>
                                                    <div className="flex gap-4">
                                                        <button
                                                            disabled={userType === 2}
                                                            onClick={() => setBookingType('ONLINE')}
                                                            className={`flex-1 py-4 rounded-2xl border-2 text-base font-bold transition-all flex flex-col items-center gap-1
                    ${userType === 2 ? 'opacity-40 cursor-not-allowed' : ''}
                                                        ${bookingType === 'ONLINE' ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                                        >
                                                            <span>화상(Zoom)</span>
                                                            {userType === 2 && <span className="text-xs opacity-70">오프라인 전용</span>}
                                                        </button>

                                                        {/* 대면(현장) - 온라인 전용(type=1)이면 비활성화 */}
                                                        <button
                                                            disabled={userType === 1}
                                                            onClick={() => setBookingType('OFFLINE')}
                                                            className={`flex-1 py-4 rounded-2xl border-2 text-base font-bold transition-all flex flex-col items-center gap-1
                                                             ${userType === 1 ? 'opacity-40 cursor-not-allowed' : ''}
                                                                ${bookingType === 'OFFLINE' ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                                        >
                                                            <span>대면(현장)</span>
                                                            {userType === 1 && <span className="text-xs opacity-70">온라인 전용</span>}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 02. 상담 유형 선택 */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                                                    <Info size={16} className="text-blue-500" /> 02. 상담 유형 선택
                                                </h4>
                                                <Select
                                                    value={selectedCategory?.code || ""}
                                                    onValueChange={(value) => {
                                                        const category = MEETING_CATEGORIES.find(c => c.code === value);
                                                        setSelectedCategory(category);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full py-6 text-base font-bold rounded-2xl border-slate-200">
                                                        <SelectValue placeholder="상담 유형을 선택해주세요" />
                                                    </SelectTrigger>
                                                    <SelectContent className="z-[110]">
                                                        {MEETING_CATEGORIES.map((category) => (
                                                            <SelectItem
                                                                key={category.code}
                                                                value={category.code}
                                                                className="py-3 text-base font-medium cursor-pointer"
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {/* 03. 날짜 선택 */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                                                    <CalendarIcon size={16} className="text-blue-500" /> 03. 날짜 선택
                                                </h4>
                                                <div className="flex justify-center">
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
                                                {selectedDate && (
                                                    <p className="text-center text-base font-bold text-slate-600">
                                                        선택된 날짜: {formatDate(selectedDate)}
                                                    </p>
                                                )}
                                            </div>

                                            {/* 04. 시간 선택 */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                                                    <Clock size={16} className="text-blue-500" /> 04. 시작 시간 (1시간 단위)
                                                </h4>
                                                {timeSlotsLoading ? (
                                                    <div className="text-center py-8">
                                                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                                                        <p className="text-slate-400 mt-4 text-base">시간대 로딩 중...</p>
                                                    </div>
                                                ) : timeSlots.length === 0 ? (
                                                    <div className="text-center py-8 bg-slate-50 rounded-2xl">
                                                        <Clock size={36} className="mx-auto mb-3 text-slate-300" />
                                                        <p className="text-slate-400 font-bold text-base">예약 가능한 시간이 없습니다.</p>
                                                        <p className="text-slate-400 text-sm mt-1">다른 날짜를 선택해주세요.</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-3">
                                                        {timeSlots.map(slot => (
                                                            <button
                                                                key={slot.time}
                                                                disabled={slot.status === 'booked'}
                                                                onClick={() => setSelectedTime(slot.time)}
                                                                className={`w-full py-4 px-6 rounded-full border-2 text-base font-bold transition-all flex items-center justify-center gap-3
                                                                ${slot.status === 'booked'
                                                                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-40'
                                                                        : selectedTime === slot.time
                                                                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                                            >
                                                                {slot.status !== 'booked' && (
                                                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                                                )}
                                                                <span>{slot.time}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {/* 4. 회의실 선택 (오프라인 전용) */}
                                            {bookingType === 'OFFLINE' && (
                                                <div className="space-y-6">
                                                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <MapPin size={14} className="text-orange-500" />
                                                        04. 회의실 선택
                                                    </h5>

                                                    {roomListLoading ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                                                            <span className="ml-3 text-slate-500">회의실 목록 조회중...</span>
                                                        </div>
                                                    ) : roomList.length === 0 ? (
                                                        <div className="text-center py-8 bg-slate-50 rounded-[20px] border-2 border-dashed border-slate-200">
                                                            <MapPin size={32} className="mx-auto mb-2 text-slate-300" />
                                                            <p className="text-slate-400 text-sm font-medium">사용 가능한 회의실이 없습니다</p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {roomList.map(room => (
                                                                <button
                                                                    key={room.id}
                                                                    onClick={() => setSelectedRoom(room)}
                                                                    className={`p-4 rounded-[20px] border-2 text-left transition-all ${selectedRoom?.id === room.id
                                                                        ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100 shadow-lg'
                                                                        : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedRoom?.id === room.id
                                                                            ? 'bg-orange-500 text-white'
                                                                            : 'bg-white text-slate-400 border border-slate-100'
                                                                            }`}>
                                                                            <MapPin size={22} />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className={`font-bold text-sm truncate ${selectedRoom?.id === room.id ? 'text-orange-600' : 'text-slate-700'
                                                                                }`}>
                                                                                {room.name}
                                                                            </p>
                                                                            <p className="text-xs text-slate-400 truncate">
                                                                                {room.location}
                                                                            </p>
                                                                            {room.maxNum && (
                                                                                <p className="text-xs text-slate-400 mt-0.5">
                                                                                    수용인원: {room.maxNum}명
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        {selectedRoom?.id === room.id && (
                                                                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
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
                                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">에약 완료</h3>
                                                <p className="text-slate-400 font-bold text-base leading-relaxed">
                                                    상담 예약이 성공적으로 완료되었습니다.<br />
                                                    선생님 확인 후 최종 확정됩니다.
                                                </p>
                                                <div className="bg-slate-50 rounded-2xl p-6 mt-4 text-left space-y-2">
                                                    <p className="text-sm">
                                                        <span className="text-slate-400">상담 유형:</span>{' '}
                                                        <span className="font-bold">{selectedCategory?.name}</span>
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="text-slate-400">상담 방식:</span>{' '}
                                                        <span className="font-bold">{bookingType === 'ONLINE' ? '화상(Zoom)' : '대면(현장)'}</span>
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="text-slate-400">예약 일시:</span>{' '}
                                                        <span className="font-bold">{formatDate(selectedDate)} {selectedTime}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 푸터 버튼 */}
                                <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                                    {step === 'select' ? (
                                        <button
                                            disabled={!selectedTime || !selectedCategory || isSubmitting || (bookingType === 'OFFLINE' && !selectedRoom)}
                                            onClick={handleConfirm}
                                            className="w-full py-5 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-xl"
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
                                            className="w-full py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
                                        >
                                            확인했습니다
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* 회의실 예약 모달 */}
                {isRoomModalOpen && selectedRoomForReservation && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={handleCloseRoomModal} />

                        <div className="relative bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">

                            {/* 좌측 정보 */}
                            <div className="hidden md:flex flex-col justify-between p-12 w-80 text-white bg-indigo-600">
                                <div className="space-y-8">
                                    <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
                                        <MapPin size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black leading-tight">{selectedRoomForReservation.name}</h3>
                                        <p className="text-white/60 text-sm mt-2">{selectedRoomForReservation.location}</p>
                                        <p className="text-white/70 font-bold mt-4 text-sm">
                                            스터디 및 회의를 위한<br />공간 예약 서비스입니다.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4 border-t border-white/10 pt-10 font-bold text-sm opacity-80">
                                    <div className="flex items-center gap-3"><Users size={18} /> 수용인원: {selectedRoomForReservation.maxNum}명</div>
                                    <div className="flex items-center gap-3"><Clock size={18} /> 시간 단위 예약</div>
                                </div>
                            </div>

                            {/* 우측 */}
                            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                                <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between">
                                    <h4 className="font-black text-xl text-slate-800">회의실 예약</h4>
                                    <button onClick={handleCloseRoomModal} className="p-3 hover:bg-slate-100 rounded-full">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto px-10 py-10 space-y-10">{roomReservationStep === 'select' ? (
                                    <>
                                        {/* 날짜 선택 */}
                                        <div className="space-y-4">
                                            <h5 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <CalendarIcon size={16} className="text-indigo-500" /> 01. 날짜 선택
                                            </h5>
                                            <div className="flex justify-center">
                                                <Calendar
                                                    mode="single"
                                                    selected={roomReservationDate}
                                                    onSelect={(date) => date && setRoomReservationDate(date)}
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
                                                        day_selected: "bg-indigo-500 text-white hover:bg-indigo-600",
                                                        day_today: "bg-slate-200 text-slate-900 font-bold",
                                                        day_outside: "text-slate-300",
                                                        day_disabled: "text-slate-300 opacity-50 cursor-not-allowed hover:bg-transparent",
                                                    }}
                                                />
                                            </div>
                                            <p className="text-center font-bold text-slate-600">
                                                선택된 날짜: {formatDate(roomReservationDate)}
                                            </p>
                                        </div>

                                        {/* 시작 시간 */}
                                        <div className="space-y-4">
                                            <h5 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Clock size={16} className="text-indigo-500" /> 02. 시작 시간
                                            </h5>
                                            <div className="grid grid-cols-4 gap-2">
                                                {roomTimeSlots.map(time => (
                                                    <button
                                                        key={`start-${time}`}
                                                        onClick={() => {
                                                            setRoomReservationStartTime(time);
                                                            const hour = parseInt(time.split(':')[0]) + 1;
                                                            if (hour <= 22) {
                                                                setRoomReservationEndTime(`${String(hour).padStart(2, '0')}:00`);
                                                            }
                                                        }}
                                                        className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${roomReservationStartTime === time
                                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 종료 시간 */}
                                        {roomReservationStartTime && (
                                            <div className="space-y-4">
                                                <h5 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Clock size={16} className="text-indigo-500" /> 03. 종료 시간
                                                </h5>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {roomTimeSlots
                                                        .filter(time => time > roomReservationStartTime)
                                                        .map(time => (
                                                            <button
                                                                key={`end-${time}`}
                                                                onClick={() => setRoomReservationEndTime(time)}
                                                                className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${roomReservationEndTime === time
                                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                                                                    : 'border-slate-200 hover:border-slate-300'
                                                                    }`}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 예약 요약 */}
                                        {roomReservationStartTime && roomReservationEndTime && (
                                            <div className="bg-indigo-50 rounded-2xl p-6">
                                                <p className="text-sm font-bold text-indigo-600">예약 정보</p>
                                                <p className="text-slate-600 mt-1">
                                                    {formatDate(roomReservationDate)} {roomReservationStartTime} ~ {roomReservationEndTime}
                                                </p>
                                            </div>
                                        )}  </>
                                ) : (
                                    /* 예약 완료 화면 */
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
                                        <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={56} />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-4xl font-black">예약 완료</h3>
                                            <p className="text-slate-400">회의실 예약이 완료되었습니다.</p>
                                            <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-2">
                                                <p><span className="text-slate-400">회의실:</span> <span className="font-bold">{selectedRoomForReservation?.name}</span></p>
                                                <p><span className="text-slate-400">위치:</span> <span className="font-bold">{selectedRoomForReservation?.location}</span></p>
                                                <p><span className="text-slate-400">예약 일시:</span> <span className="font-bold">{formatDate(roomReservationDate)} {roomReservationStartTime} ~ {roomReservationEndTime}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>

                                {/* 예약 버튼 */}
                                <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                                    {roomReservationStep === 'select' ? (
                                        <button
                                            disabled={!roomReservationStartTime || !roomReservationEndTime || roomReservationSubmitting}
                                            onClick={handleRoomReservationConfirm}
                                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-lg transition-all"
                                        >
                                            {roomReservationSubmitting
                                                ? '예약 중...'
                                                : !roomReservationStartTime
                                                    ? '시작 시간을 선택해 주세요'
                                                    : !roomReservationEndTime
                                                        ? '종료 시간을 선택해 주세요'
                                                        : `${roomReservationStartTime} ~ ${roomReservationEndTime} 예약하기`}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCloseRoomModal}
                                            className="w-full py-5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all"
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
const TeacherCard = ({ teacher, onClick }) => {
    const imageUrl = teacher.profileImage || teacher.fileUrl || teacher.url;

    return (
        <div
            onClick={onClick}
            className="group relative bg-white border border-slate-200 rounded-[40px] p-8 transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between min-h-[280px] overflow-hidden"
        >
            <div className="flex justify-between items-start mb-6 z-10">
                <div className="relative">
                    <img
                        src={
                            imageUrl
                                ? `${import.meta.env.VITE_FILE_URL_HEADER}${imageUrl}`
                                : `https://i.pravatar.cc/150?u=${teacher.teacherId || teacher.id}`
                        }
                        alt={teacher.name}
                        className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-50 shadow-md group-hover:ring-blue-50 transition-all"
                        onError={(e) => {
                            e.target.src = `https://i.pravatar.cc/150?u=${teacher.teacherId || teacher.id}`;
                        }}
                    />
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                    {Array.isArray(teacher.tags) && teacher.tags.length > 0 ? (
                        teacher.tags.map((tag) => (
                            <Badge key={tag} className="text-[12px] font-bold px-3 py-1.5 rounded-full bg-slate-200 text-slate-700">
                                {tag}
                            </Badge>
                        ))
                    ) : (
                        <div className="px-5 py-2.5 rounded-full bg-blue-100 text-blue-700 text-sm font-extrabold tracking-wide shadow-sm">
                            상담가능
                        </div>
                    )}
                </div>
            </div>

            <div className="z-10">
                <h3 className="text-2xl font-black mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                    {teacher.name}
                    <span> </span>
                    <span className="font-black">강사</span>
                </h3>
                <p className="text-sm text-slate-400 font-bold mt-2 leading-relaxed">
                    {teacher.subject || "상담 전문"}
                </p>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-8 z-10">
                <span className="text-slate-400 flex items-center gap-2 font-bold text-[17px] uppercase tracking-widest leading-none">
                    <Clock size={20} className="text-blue-500" /> 1시간
                </span>
                <div className="w-12 h-12 rounded-full bg-slate-200/70 text-slate-900 flex items-center justify-center group-hover:scale-110 transition-all shadow-xl">
                    <ArrowRight size={20} />
                </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors" />
        </div>
    );
};
const RoomCard = ({ room, onClick }) => (
    <div
        onClick={onClick}
        className="group relative bg-white border border-slate-200 rounded-[40px] p-8 transition-all duration-300 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between min-h-[280px] overflow-hidden"
    >
        <div className="flex justify-between items-start mb-6 z-10">
            <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center">
                <MapPin size={32} className="text-indigo-600" />
            </div>
            <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-extrabold">
                예약가능
            </div>
        </div>
        <div className="z-10">
            <h3 className="text-2xl font-black mb-1 group-hover:text-indigo-600 transition-colors leading-tight">
                {room.name}
            </h3>
            <p className="text-sm text-slate-400 font-bold mt-2">
                {room.location}
            </p>
            <p className="text-sm text-slate-400 mt-1">
                수용인원: <span className="font-bold text-slate-600">{room.maxNum}명</span>
            </p>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-8 z-10">
            <span className="text-slate-400 flex items-center gap-2 font-bold text-sm">
                <Clock size={16} className="text-indigo-500" />
                09:00 ~ 22:00
            </span>
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-all">
                <ArrowRight size={20} />
            </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors" />
    </div>
);
export default OrganizationServiceSection;