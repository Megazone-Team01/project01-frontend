
import axiosInstance from '@/common/api/axiosInstance';

export const getTeachersByOrganization = async (organizationId) => {
    const response = await axiosInstance.get('v1/meetings/teachers', {
        params: { organizationId }
    });
    return response.data;
};

export const getTeacherDetail = async (teacherId) => {
    const response = await axiosInstance.get(`v1/meetings/teachers/${teacherId}`);
    return response.data;
};

export const getMyMeetings = async (type = 'ALL', status = null) => {
    const response = await axiosInstance.get('v1/meetings/my', {
        params: { type, status }
    });
    return response.data;
};

export const createMeeting = async (meetingData) => {
    const response = await axiosInstance.post('/v1/meetings', meetingData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};


export const cancelMeeting = async (meetingId, isOnline) => {
    const response = await axiosInstance.delete(
        `/v1/meetings/${meetingId}?isOnline=${isOnline}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
    );
    return response.data;
};

export const approveMeeting = async (meetingId, isOnline, location = null) => {
    const response = await axiosInstance.patch(
        `/v1/meetings/${meetingId}/approve`,
        { location },
        { params: { isOnline } }
    );
    return response.data;
};


export const rejectMeeting = async (meetingId, isOnline, reason) => {
    const response = await axiosInstance.patch(
        `/v1/meetings/${meetingId}/reject`,
        { reason },
        { params: { isOnline } }
    );
    return response.data;
};

export const getAvailableTimes = async (teacherId, date) => {
    const response = await axiosInstance.get(
        `/v1/meetings/teachers/${teacherId}/available-times`,
        { params: { date } }
    );
    return response.data;
};

export const getTeacherMeetings = async (type = 'ALL', status = null) => {
    const response = await axiosInstance.get('v1/meetings/teacher/my', {
        params: { type, status }
    });
    return response.data;
};
