import axiosInstance from "@/common/api/axiosInstance.js"

export const getLectures = async () => {
    const res = await axiosInstance.get("/v1/lectures/filter")
    return res.data;
}

export const getJudgedLectures = async () => {
    const res = await axiosInstance.get("/v1/lectures/filter", {
        params: {
            status: 0
        }
    })
    return res.data;
}

export const approveLecture = async ( id ) => {
    const res = await axiosInstance.post("/v1/lectures/approve/" + id )
    return res.status;
}
export const rejectLecture = async ( id ) => {
    const res = await axiosInstance.post("/v1/lectures/reject/" + id )
    return res.status;
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
    const res = await axiosInstance.post( "/v1/lectures", req );
    return res.status;
}

export const getLectureDetail = async ( id, isOnline ) => {
    const res = await axiosInstance.get( "/v1/lectures/" + id + "/" + isOnline );
    console.log( res.data )
    return res.data;
}