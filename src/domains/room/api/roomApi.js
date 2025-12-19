import axiosInstance from '@/common/api/axiosInstance';
import { useParams } from 'react-router';

export const roomApi = {
    // 회의실 목록 조회
    getRooms: async (organizationId) => {
        const response = await axiosInstance.get('v1/rooms', {
            params: { organizationId }
        });
        return response.data;
    },

    // 회의실 상세 조회 (다음 단계에서 사용)
    getStudyRoomDetail: async (roomId) => {
        const response = await axiosInstance.get(`v1/rooms/${roomId}`);
        return response.data;
    }
};

export default roomApi;