import axiosInstance from '@/common/api/axiosInstance';

export const getMyReservations = async (includePast = false) => {
    const response = await axiosInstance.get('/v1/reservations/my', {
        params: { includePast }
    });
    return response.data;
};


export const createReservation = async (data) => {
    const response = await axiosInstance.post('/v1/reservations', data);
    return response.data;
};

export const cancelReservation = async (reservationId) => {
    const response = await axiosInstance.delete(`/v1/reservations/${reservationId}`);
    return response.data;
};