import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users } from "lucide-react";
import { roomApi } from "@/domains/room/api/roomApi";
import { useNavigate } from "react-router"

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const organizationId = 1;
                const data = await roomApi.getRooms(organizationId);
                setRooms(data);
            } catch (error) {
                console.error("회의실 목록 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <Skeleton className="h-10 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>다시 시도</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/* 상단 헤더 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">회의실 예약</h1>
                <p className="text-gray-500">이용할 회의실을 선택하세요.</p>
            </div>

            {/* RoomCard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* 이미지 영역 */}
                        <div className="h-48 overflow-hidden bg-gray-100">
                            <img
                                src={room.imageUrl || "https://via.placeholder.com/400x200?text=Study+Room"}
                                alt={room.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl flex justify-between items-center">
                                {room.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{room.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span>최대 {room.maxNum}명 이용가능</span>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => navigate(`/studyroom/${room.roomId}`)}
                            >
                                예약하기
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default RoomList;