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
        params: {
            ...filter,
            statusCode: 1,
        }
    } );
    return res.data;
}

export const getOrganization = async (organizationId) => {
    const res = await axiosInstance.get("/v1/organization/" + organizationId + "/detail");
    return res.data;
}

export const getOrganizationTeacher = async ( id ) => {
    const res = await axiosInstance.get( "/v1/user/teacher/organization/" + id );
    return res.data;
}

export const getOrganizationLecture = async ( id ) => {
    const res = await axiosInstance.get( "/v1/organization/" + id + "/lectures" );
    return res.data;
}

export const applyOrganization = async ( organizationId ) => {
    const res = await axiosInstance.post( "/v1/organization/apply/" + organizationId );
    return res;
}
