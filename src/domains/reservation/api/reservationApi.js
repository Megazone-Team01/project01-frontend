import axiosInstance from '@/common/api/axiosInstance';

export const reservationApi = {

    // 나의 예약 목록 조회
    getMyReservations: async (includePast = false) => {
        const response = await axiosInstance.get('/v1/reservations/my', {
            params: {
                userId: 1, // 임시 userId 하드코딩
                includePast
            }
        });
        return response.data;
    }
};