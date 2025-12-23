import axiosInstance from '@/common/api/axiosInstance';

export const getAvailableRooms = async (organizationId) => {
    const response = await axiosInstance.get('/v1/rooms', {
        params: { organizationId }
    });
    return response.data;
};

export const getRoomDetail = async (roomId) => {
    const response = await axiosInstance.get(`/v1/rooms/${roomId}`);
    return response.data;
};

export const roomApi = {
    getRooms: getAvailableRooms,
    getStudyRoomDetail: getRoomDetail,
};

export default roomApi;