import axiosInstance from "@/common/api/axiosInstance.js"

export const getUsers = async () => {
    const res = await axiosInstance.get("/v1/user",
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
    const res = await axiosInstance.get( "/v1/user",
        {
            params: {
                searchString: null,
                userRole: filter.userRole,
                type: filter.type
            }
        });
    return res.data;
}

export const getOrganizationTeacher = async () => {
    const res = await axiosInstance.get( "/v1/user/teacher/organization" );
    return res.data;
}

export const deleteUser = async (id, deletedBy) => {
    const res = await axiosInstance.delete( "/v1/organization/" + id, {
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
    const res = await axiosInstance.post( "/v1/user/signup", formData );
    return res.data;
}

export const getUserDetail = async ( id ) => {
    const res = await axiosInstance.get( "/v1/user/" + id );
    return res.data;
}