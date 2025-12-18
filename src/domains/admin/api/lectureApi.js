import axiosInstance from "../../../common/api/axiosInstance.js"

export const getLectures = async () => {
    const res = await axiosInstance.get("/lectures/filter")
    console.log( res )
    return res.data;
}

export const createLecture = async (data) => {
    console.log( data );
    const req = {
        name: data.name,
        organizationId: data.organizationId,
        teacherId: data.teacherId,
        category: data.category,
        description: data.description,
        type: data.type,
        fileId: data.fileId,
        maxNum: data.maxNum,
        roomId: data.roomId,
        startTimeAt: data.startTimeAt,
        endTimeAt: data.endTimeAt,
        startAt: data.startAt,
        endAt: data.endAt,
        dayValue: data.day
    }
    const res = await axiosInstance.post( "/lectures", req );
    return res.status;
}