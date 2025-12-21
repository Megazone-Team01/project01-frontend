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
export const getRecentCreatedLectures = async () => {
    const res = await axiosInstance.get("/v1/lectures/filter", {
        params: {
            sortBy: "RECENT"
        }
    })
    return res.data;
}
export const getLectureByFilter = async ( filter ) => {
    const res = await axiosInstance.get("/v1/lectures/filter", {
        params: {
            isOnline: filter.type,
            searchString: filter.searchString,
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

export const deleteLecture = async ( id, isOnline ) => {
    try {
        const res = await axiosInstance.delete( "/v1/lectures/" + id, {
            params:
                {
                    isOnline: isOnline
                }
        });
        return res;
    }
    catch( error ){
        if( error.status === 401 ) alert( error.response.data.message )
    }
}

export const updateLecture = async ( data ) => {
    const id = data.id;
    const req = {
        isOnline : data.isOnline,
        name : data.name,
        price: data.price,
        startAt: data.startAt,
        endAt: data.endAt,
        description: data.description,
        maxNum: data.maxNum,
        days: data.day,
        startTimeAt: data.startTimeAt,
        endTimeAt: data.endTimeAt
    }
    const res = await axiosInstance.patch( "/v1/lectures/" + id , req );
    return res.status;
}