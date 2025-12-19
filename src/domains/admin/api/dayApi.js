import axiosInstance from "@/common/api/axiosInstance.js"

export const getDays = async () => {
    const res = await axiosInstance.get("/v1/day")
    return res.data
}

export const createDay = async ( name, value ) => {
    const res = await axiosInstance.post("/v1/day", null, {
        params: {
            name: name,
            value: value
        }
    })
    return res.status;
}