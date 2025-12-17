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
    return res.data;
}

export const getUsersWithFilter = async ( filter ) => {
    const res = await axiosInstance.get( "/user",
        {
            params: {
                searchString: null,
                userRole: filter.userRole,
                type: filter.type
            }
        });
    console.log( res )
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

export const createUser = async ( data ) => {
    const formData = {
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        name: data.name,
        phone: data.phone,
        addressCode: data.addressCode,
        addressDetail: data.addressDetail,
        role: data.role,
        type: data.type
    }
    const res = await axiosInstance.post( "/user/signup", formData );
    return res.data;
}