import axiosInstance from "../../../common/api/axiosInstance.js"

export const getCategories = async ( parentId ) => {
    const res = await axiosInstance.get("/category", {
        params: {
            parentId: parentId
        }
    });
    return res.data;
}