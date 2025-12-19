
import { useState, useEffect } from 'react';
import { X, Calendar, Info, Video, MapPin, CheckCircle2 } from 'lucide-react';
import { useAvailableTimes } from '@/domains/meeting/hook/useAvailableTimes';
import { useCreateMeeting } from '@/domains/meeting/hook/useCreateMeeting';
import CalendarPicker from './CalendarPicker';
import TimeSlotPicker from './TimeSlotPicker';

const BookingDrawer = ({ open, onClose, target, organizationId, onComplete }) => {
    const [step, setStep] = useState('select'); // 'select' | 'success'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookingType, setBookingType] = useState('ONLINE');

    const dateString = selectedDate.toISOString().split('T')[0];

    // 예약 가능 시간 조회
    const { slots, loading: slotsLoading } = useAvailableTimes(
        target?.type === 'teacher' ? target.data.id : null,
        dateString
    );

    // 예약 생성
    const { create, loading: createLoading } = useCreateMeeting();

    // 드로어 열릴 때 초기화
    useEffect(() => {
        if (open) {
            setStep('select');
            setSelectedTime(null);
        }
    }, [open]);

    const handleConfirm = async () => {
        if (!target || !selectedTime) return;

        const result = await create({
            organizationId,
            teacherId: target.type === 'teacher' ? target.data.id : undefined,
            roomId: target.type === 'room' ? target.data.id : undefined,
            date: dateString,
            startTime: selectedTime,
            endTime: calculateEndTime(selectedTime),
            type: bookingType,
        });

        if (result.success) {
            setStep('success');
        }
    };

    if (!target) return null;

    return (
        <>
            {/* 오버레이 */}
            <div
                className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* 드로어 */}
            <div
                className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl 
          transition-transform duration-500 ease-out w-full md:w-[480px]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* 헤더 */}
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                <Calendar size={20} />
                            </div>
                            <h2 className="text-xl font-bold">
                                {target.type === 'teacher' ? '상담 예약' : '공간 예약'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    {/* 본문 */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {step === 'select' ? (
                            <>
                                {/* 선택된 대상 정보 */}
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                    <img
                                        src={target.data.profileImage || target.data.image}
                                        className="w-12 h-12 rounded-xl object-cover"
                                        alt=""
                                    />
                                    <div>
                                        <h4 className="font-bold">{target.data.name}</h4>
                                        <p className="text-xs text-slate-500">
                                            {target.data.subject || target.data.location}
                                        </p>
                                    </div>
                                </div>

                                {/* 상담 방식 (선생님인 경우) */}
                                {target.type === 'teacher' && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase">상담 방식</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setBookingType('ONLINE')}
                                                className={`p-4 rounded-xl border-2 flex items-center gap-2 transition-all
                          ${bookingType === 'ONLINE'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-slate-100 hover:border-slate-200'}`}
                                            >
                                                <Video size={18} /> 온라인
                                            </button>
                                            <button
                                                onClick={() => setBookingType('OFFLINE')}
                                                className={`p-4 rounded-xl border-2 flex items-center gap-2 transition-all
                          ${bookingType === 'OFFLINE'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-slate-100 hover:border-slate-200'}`}
                                            >
                                                <MapPin size={18} /> 오프라인
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* 날짜 선택 */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase">날짜 선택</h3>
                                    <CalendarPicker selected={selectedDate} onSelect={setSelectedDate} />
                                </div>

                                {/* 시간 선택 */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase">시간 선택</h3>
                                    <TimeSlotPicker
                                        slots={slots}
                                        selectedTime={selectedTime}
                                        onSelect={setSelectedTime}
                                        loading={slotsLoading}
                                    />
                                </div>

                                {/* 안내 */}
                                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700">
                                    <Info size={18} className="shrink-0 mt-0.5" />
                                    <p className="text-xs leading-relaxed">
                                        같은 선생님과의 상담은 하루 1회만 가능합니다.
                                    </p>
                                </div>
                            </>
                        ) : (
              /* 완료 화면 */}
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full 
                  flex items-center justify-center">
                                <CheckCircle2 size={56} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">예약 완료!</h3>
                                <p className="text-slate-500">
                                    {dateString} {selectedTime}<br />
                                    상담 링크가 전송될 예정입니다.
                                </p>
                            </div>
                            <button
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
                                onClick={onComplete}
                            >
                                확인
                            </button>
                        </div>
            )}
                    </div>

                    {/* 푸터 */}
                    {step === 'select' && (
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <button
                                disabled={!selectedTime || createLoading}
                                onClick={handleConfirm}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 
                  text-white rounded-2xl font-bold transition-all"
                            >
                                {createLoading ? '예약 중...' : '예약 확정하기'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// 시간 계산 헬퍼
const calculateEndTime = (startTime) => {
    const [hour, min] = startTime.split(':').map(Number);
    return `${String(hour + 1).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
};

export default BookingDrawer;