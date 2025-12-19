
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Building, Users } from "lucide-react";

function ReservationCard({ reservation, type = 'upcoming' }) {
    const isUpcoming = type === 'upcoming';

    // 날짜 포맷팅 (YYYY. MM. DD (요일))
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    // 시간 포맷팅 (HH:MM)
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24시간제
        });
    };

    return (
        <Card className={`border-l-4 transition-all hover:shadow-md ${isUpcoming ? 'border-l-green-500' : 'border-l-gray-300 opacity-70 bg-gray-50'}`}>
            <CardContent className="pt-6">
                {/* 상단: 룸 이름 + 상태 뱃지 */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                            <MapPin className="h-5 w-5 text-primary" />
                            {reservation.roomName}
                        </h3>
                        <p className="text-sm text-gray-500 ml-7">
                            {reservation.roomLocation}
                        </p>
                    </div>
                    <Badge variant={isUpcoming ? 'default' : 'secondary'} className={isUpcoming ? "bg-green-600 hover:bg-green-700" : ""}>
                        {isUpcoming ? '이용 예정' : '이용 완료'}
                    </Badge>
                </div>

                {/* 중간: 상세 정보 */}
                <div className="space-y-3 text-sm text-gray-700 mb-4 ml-1">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{formatDate(reservation.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                            {formatTime(reservation.startAt)} - {formatTime(reservation.endAt)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{reservation.organizationName}</span>
                    </div>
                    {/* 백엔드 더미데이터에는 없지만 추후 추가될 수 있는 필드 안전하게 처리 */}
                    {reservation.maxNum && (
                        <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>최대 {reservation.maxNum}명</span>
                        </div>
                    )}
                </div>

                {/* 하단: 버튼들 (예정된 예약만) */}
                {isUpcoming && (
                    <div className="flex gap-2 justify-end border-t pt-4 mt-2">
                        <Button variant="outline" size="sm">
                            위치 보기
                        </Button>
                        <Button variant="destructive" size="sm">
                            예약 취소
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ReservationCard;