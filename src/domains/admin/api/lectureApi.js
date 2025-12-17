import axiosInstance from "../../../common/api/axiosInstance.js"

export const getLectures = async () => {
    const res = await axiosInstance.get("/lectures/filter")
    console.log( res )
    return res.data;
}