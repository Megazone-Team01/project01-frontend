import axiosInstance from "../../../common/api/axiosInstance.js";

export const getOrganizations = async () => {
    const res = await axiosInstance.get("/v1/organization",
        {
            params: {
                ownerId: null,
                statusCode: 1,
                name: null
            }
        });
    return res.data;
}

export const getOrganizationsWithFilter = async ( filter ) => {
    const res = await axiosInstance.get( "/v1/organization", {
        params: filter
    } );
    return res.data;
}

export const getOrganization = async (organizationId) => {
    const res = await axiosInstance.get("/v1/organization/" + organizationId + "/detail");
    return res.data;
}
