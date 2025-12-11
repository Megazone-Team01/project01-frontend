import axiosInstance from '@/common/api/axiosInstance';
export const reservationApi = {

    // 나의 예약 목록 조회
    getMyReservations: async (includePast = false) => {
        const response = await axiosInstance.get('/reservations/my', {
            params: { includePast }
        });
        return response.data;
    }
};