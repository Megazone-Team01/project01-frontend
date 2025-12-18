import axiosInstance from "../../../common/api/axiosInstance.js"

export const getCategories = async ( parentId ) => {
    const res = await axiosInstance.get("/category", {
        params: {
            parentId: parentId
        }
    });
    return res.data;
}

export const createCategory = async ( data ) => {
    const req = {
        name: data.name,
        description: data.description,
        code: data.code,
        parentId: data.parentId
    }
    console.log( req )
    const res = await axiosInstance.post("/category", req);
    return res.status;
}