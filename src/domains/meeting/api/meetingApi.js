
import axiosInstance from '@/common/api/axiosInstance';

export const getTeachersByOrganization = async (organizationId) => {
    const response = await axiosInstance.get('/v1/meetings/teachers', {
        params: { organizationId }
    });
    return response.data;
};

export const getMyMeetings = async (type = 'ALL', status = null) => {
    const response = await axiosInstance.get('/v1/meetings/my', {
        params: { type, status }
    });
    return response.data;
};