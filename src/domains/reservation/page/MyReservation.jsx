import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, History } from "lucide-react";
import ReservationCard from "../components/ReservationCard";
import { reservationApi } from "@/domains/reservation/api/reservationApi";

function MyReservation() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPast, setShowPast] = useState(false);
    const [error, setError] = useState(null);

    // 데이터 불러오기
    const fetchReservations = async () => {
        try {
            setLoading(true);
            const data = await reservationApi.getMyReservations();
            setReservations(data);
            setError(null);
        } catch (err) {
            console.error('예약 목록 조회 실패:', err);
            setError('예약 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    // 날짜 기준 분류
    const now = new Date();
    const upcomingReservations = reservations.filter(
        r => new Date(r.startAt) >= now
    );
    const pastReservations = reservations.filter(
        r => new Date(r.startAt) < now
    );

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-3xl space-y-4">
                <Skeleton className="h-10 w-48 mb-6" />
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            {/* 헤더 섹션 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CalendarDays className="h-7 w-7 text-primary" />
                        내 예약 관리
                    </h1>
                    <p className="text-gray-500 mt-1">신청한 상담과 회의실 내역을 확인하세요.</p>
                </div>

                {/* 토글 버튼 */}
                <Button
                    variant={showPast ? "secondary" : "outline"}
                    onClick={() => setShowPast(!showPast)}
                    className="gap-2"
                >
                    <History className="h-4 w-4" />
                    {showPast ? "예정된 예약만 보기" : "지난 예약 내역 보기"}
                </Button>
            </div>

            {/* 예약 없음 (전체) */}
            {!loading && reservations.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <CalendarDays className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">예약된 내역이 없습니다</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            새로운 상담이나 회의실을 예약해보세요.
                        </p>
                        <Button onClick={() => window.location.href = '/'}>
                            예약하러 가기
                        </Button>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-8">
                {/* 예정된 예약 리스트 */}
                {upcomingReservations.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            이용 예정 ({upcomingReservations.length})
                        </h2>
                        <div className="grid gap-4">
                            {upcomingReservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.reservationId}
                                    reservation={reservation}
                                    type="upcoming"
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 지난 예약 리스트 (토글됨) */}
                {showPast && pastReservations.length > 0 && (
                    <section className="pt-4 border-t">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-600">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            지난 이용 내역 ({pastReservations.length})
                        </h2>
                        <div className="grid gap-4">
                            {pastReservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.reservationId}
                                    reservation={reservation}
                                    type="past"
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 지난 내역 보기를 켰는데 지난 내역이 없는 경우 */}
                {showPast && pastReservations.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        지난 예약 내역이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyReservation;