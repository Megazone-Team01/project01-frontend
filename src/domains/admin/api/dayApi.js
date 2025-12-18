import axiosInstance from "../../../common/api/axiosInstance.js"

export const getDays = async () => {
    const res = await axiosInstance.get("/day")
    return res.data
}

export const createDay = async ( name, value ) => {
    const res = await axiosInstance.post("/day", null, {
        params: {
            name: name,
            value: value
        }
    })
    return res.status;
}