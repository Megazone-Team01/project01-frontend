import axiosInstance from "@/common/api/axiosInstance.js"

export const getCategories = async ( parentId ) => {
    const res = await axiosInstance.get("/v1/category", {
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
    const res = await axiosInstance.post("/v1/category", req);
    return res.status;
}

export const deleteCategory = async ( id ) => {
    const res = await axiosInstance.delete("/v1/category/" + id )
    return res.status;
}