import axiosInstance from "./axiosInstance.js"

export const fileUpload = async ( data ) => {
    try {
        const formData = new FormData();
        formData.append( "file", data )
        formData.append( "uploaderId", 1 )
        console.log( formData )
        const res = await axiosInstance.post( "/file/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return res.data;
    }
    catch ( error ) {
        if( error.status === 413 ) alert( "파일의 크기가 너무 큽니다" )
        else console.error( error )
    }
}

export const loadLectureWithFile = async ( lectureId ) => {
    try {
        const res = await axiosInstance.get( "/file/" + lectureId + "/lecture" );
        return res.data;
    }
    catch ( error ) {
        console.error( error );
    }
}