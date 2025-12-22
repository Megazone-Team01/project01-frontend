import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: !!localStorage.getItem("accessToken"),
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("accessToken") || null,
    userRole:""
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;

            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
        refreshAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
            localStorage.setItem("accessToken", action.payload.accessToken);
        },
        setUseRole: (state, action) => {
            state.userRole = action.payload.userRole;
        }
    },
});

export const { setUserRole,loginSuccess, logout, refreshAccessToken } = authSlice.actions;
export default authSlice.reducer;
