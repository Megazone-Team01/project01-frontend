
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
import { getTeacherDetail } from '@/domains/meeting/api/meetingApi';
import { getOrganizationLecture, getOrganizationTeacher } from "@/domains/organization/api/organizationApi.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Label } from "@/components/ui/label.js";
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


    const [organizationTeachers, setOrganizationTeachers] = useState([]);
    const [organizationLectures, setOrganizationLectures] = useState([]);


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
        // 팝업 핸들러
        const handleOpenModal = async (item) => {
            setSelectedItem(item);
            setIsModalOpen(true);
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

            useEffect(() => {
                const fetchData = async () => {
                    const data = await getOrganizationTeacher(organizationId);
                    setOrganizationTeachers(data);

                    const lecData = await getOrganizationLecture(organizationId);
                    setOrganizationLectures(lecData);
                }
                fetchData()
            }, []);

            console.log(organizationLectures)

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
                                        onClick={() => setActiveTab(2)}
                                        className={`flex items-center gap-2.5 px-8 py-2 rounded-3xl text-sm font-black transition-all
                                ${activeTab === 2 ? 'bg-white text-gray-600 shadow-xl scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <UserCheck size={25} />
                                        <span>멘토 강사 상담</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab(3)}
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
                                                            <div className="w-full min-h-36 flex justify-center items-center">
                                                                <ImageIcon size={25} />
                                                            </div>
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
                                                                <div className="w-full h-40 flex justify-center items-center">
                                                                    <ImageIcon size={25} />
                                                                </div>
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
                                                    <div className="col-span-full text-center py-32 bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                                                        <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                                                        <p className="text-slate-400 font-bold">회의실 기능은 현재 준비 중입니다.</p>
                                                    </div>
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
                                <div className="relative bg-white w-full max-w-3xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col md:flex-row max-h-[95vh]">

                                    {/* 좌측 정보 바 */}
                                    <div className={`hidden md:flex flex-col justify-between p-12 w-80 text-white ${activeTab === 'meeting' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                                        <div className="space-y-8">
                                            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                                                {activeTab === 'meeting' ? <UserCheck size={32} /> : <Monitor size={32} />}
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black leading-tight">{selectedItem?.name}</h3>
                                                {selectedItem?.email && (
                                                    <p className="text-white/60 text-sm mt-2">{selectedItem.email}</p>
                                                )} {/*TODO : 선생님이 강의하는 강의명 리스트 표시 추가 가능*/}
                                                <p className="text-white/70 font-bold mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                                                    {activeTab === 'meeting' ? '선택하신 강사님과의\n1:1 멘토링 상담 예약입니다.' : '효율적인 학습을 위한\n독립 공간 예약 서비스입니다.'}
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
                                        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                                            <h4 className="font-black text-slate-800 text-xl tracking-tighter uppercase italic">Step. Schedule</h4>
                                            <button onClick={handleCloseModal} className="p-3 hover:bg-slate-100 rounded-full text-slate-300 transition-colors"><X size={28} /></button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto px-10 py-10 space-y-12 custom-scrollbar">
                                            {step === 'select' ? (
                                                <>
                                                    {/* 1. 상담 방식 선택 (상담 전용) */}
                                                    {activeTab === 'meeting' && (
                                                        <div className="space-y-6">
                                                            <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Video size={14} className="text-blue-500" /> 01. 상담 방식 선택</h5>
                                                            <div className="flex gap-4">
                                                                {['ONLINE', 'OFFLINE'].map(mode => (
                                                                    <button
                                                                        key={mode}
                                                                        onClick={() => setBookingType(mode)}
                                                                        className={`flex-1 py-4 rounded-[20px] border-2 text-sm font-black transition-all
                                                                ${bookingType === mode ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                                                    >
                                                                        {mode === 'ONLINE' ? '화상(Zoom)' : '대면(현장)'}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* 2. 날짜 선택 */}
                                                    <div className="space-y-6">
                                                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><CalendarIcon size={14} className="text-blue-500" /> 02. 날짜 선택</h5>
                                                        <div className="grid grid-cols-7 gap-2 bg-slate-50 p-6 rounded-[32px] border border-slate-100 shadow-inner text-center">
                                                            {weekDays.map(d => <span key={d} className="text-[10px] text-slate-300 font-black">{d}</span>)}
                                                            {dates.map((date, i) => {
                                                                const isSelected = date.toDateString() === selectedDate.toDateString();
                                                                return (
                                                                    <button
                                                                        key={i}
                                                                        onClick={() => setSelectedDate(date)}
                                                                        className={`aspect-square flex items-center justify-center rounded-2xl text-sm font-black transition-all
                                                                ${isSelected ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'hover:bg-white text-slate-600'}`}
                                                                    >
                                                                        {mode === 'ONLINE' ? '화상(Zoom)' : '대면(현장)'}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* 3. 시간 선택 */}
                                                    <div className="space-y-6">
                                                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Clock size={14} className="text-blue-500" /> 03. 시작 시간 (1시간 단위)</h5>
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                            {timeSlots.map(slot => (
                                                                <button
                                                                    key={slot.time}
                                                                    disabled={slot.status === 'booked'}
                                                                    onClick={() => setSelectedTime(slot.time)}
                                                                    className={`py-4 rounded-[20px] border-2 text-xs font-black transition-all 
                                                            ${slot.status === 'booked' ? 'bg-slate-50 text-slate-300 cursor-not-allowed line-through' :
                                                                            selectedTime === slot.time ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-50' :
                                                                                'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                                                                >
                                                                    {slot.time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                /* 팝업 완료 화면 */
                                                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20 animate-in zoom-in-95 duration-700">
                                                    <div className="relative">
                                                        <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner relative">
                                                            <CheckCircle2 size={56} />
                                                            <div className="absolute -inset-4 bg-emerald-100 rounded-full -z-10 animate-ping opacity-20" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Success.</h3>
                                                        <p className="text-slate-400 font-bold text-base leading-relaxed">
                                                            신청이 성공적으로 완료되었습니다.<br />
                                                            관리자 확인 후 최종 확정 알림톡이 발송됩니다.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* 팝업 푸터 버튼 */}
                                        <div className="p-10 border-t border-slate-50 bg-slate-50/50 mt-auto">
                                            {step === 'select' ? (
                                                <button
                                                    disabled={!selectedTime}
                                                    onClick={handleConfirm}
                                                    className="w-full py-6 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-[28px] font-black text-xl transition-all active:scale-95 shadow-2xl"
                                                >
                                                    {selectedTime ? `${selectedTime}에 예약하기` : '시간을 선택해 주세요'}
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