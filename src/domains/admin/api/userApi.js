import axiosInstance from "../../../common/api/axiosInstance.js"

export const getUsers = async () => {
    const res = await axiosInstance.get("/user",
        {
            params: {
                searchString: null,
                userRole: null,
                type: null
            }
        }
        );
    console.log( res.data )
    return res.data;
}

export const deleteUser = async (id, deletedBy) => {
    const res = await axiosInstance.delete( "/organization/" + id, {
        params: {
            deletedBy: deletedBy
        }
    });
    return res.data;
}