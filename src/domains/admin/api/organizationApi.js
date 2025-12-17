import axiosInstance from "../../../common/api/axiosInstance.js"

export const getOrganizations = async () => {
    const res = await axiosInstance.get( "/organization" );
    return res.data;
}

export const deleteOrganization = async (id, deletedBy) => {
    const res = await axiosInstance.delete( "/organization/" + id,
        {
            params: {
                deletedBy: deletedBy
            }
        } );
    return res.data;
}

export const createOrganization = async ( data ) => {
    console.log( data )
    const res = await axiosInstance.post( "/organization/create", {
        name: data.name,
        webpage: data.webpage,
        ownerId: data.ownerId,
        tel: data.tel,
        addressCode: data.addressCode,
        addressDetail: data.addressDetail,
        isOnline: data.type,
        description: data.description
    } );
    return res.status;
}