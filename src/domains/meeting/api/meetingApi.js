
import axiosInstance from '@/common/api/axiosInstance';

export const getTeachersByOrganization = async (organizationId) => {
    const response = await axiosInstance.get('/meetings/teachers', {
        params: { organizationId }
    });
    return response.data;
};


export const getTeacherDetail = async (teacherId) => {
    const response = await axiosInstance.get(`/meetings/teachers/${teacherId}`);
    return response.data;
};


export const getMyMeetings = async (type = 'ALL', status = null) => {
    const response = await axiosInstance.get('/meetings/my', {
        params: { type, status }
    });
    return response.data;
};