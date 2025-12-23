export const getTeacherDetail = async (teacherId) => {
    const response = await axiosInstance.get(`/v1/meetings/teachers/${teacherId}`);  // ✅ 괄호 추가!
    return response.data;
};