import axiosInstance from "@/common/api/axiosInstance.js"

export const getRooms = async ( organizationId ) => {
    const res = await axiosInstance.get( "/v1/rooms", {
        params: {
            organizationId: organizationId
        }
    });
    return res.data;
}