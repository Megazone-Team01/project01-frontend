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