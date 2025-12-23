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
                searchString: filter.searchString,
                userRole: filter.userRole,
                type: filter.type,
                sortBy: filter.sortBy,
            }
        });
    return res.data;
}

export const getOrganizationTeacher = async () => {
    const res = await axiosInstance.get( "/v1/user/teacher/organization" );
    return res.data;
}

export const deleteUser = async (id) => {
    try{
        const res = await axiosInstance.delete( "/v1/user/" + id );
        return res;
    }
    catch( error ){
        if( error.status === 401 ) alert( error.response.data.message )
    }


}

export const createUser = async ( data ) => {
    const formData = {
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        name: data.name,
        phone: data.phone,
        address: data.address,
        addressDetail: data.addressDetail,
        role: data.role,
        type: data.type
    }
    try {
        const res = await axiosInstance.post( "/v1/user/signup", formData );
        return res.data;
    }
    catch ( error ){
        alert( error.response.data.message );
    }

}

export const getUserDetail = async ( id ) => {
    const res = await axiosInstance.get( "/v1/user/" + id );
    return res.data;
}

export const adminUpdateUser = async ( id , data ) => {
    try {
        const res = await axiosInstance.patch( "/v1/user/update/" + id + "/admin", data );
        return res.data;
    }
    catch ( error ){
        if( error.status === 401 ) alert( error.response.data.message )
    }
}