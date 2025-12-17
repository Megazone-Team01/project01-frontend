// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import lectureReducer from './lecture/lectureStore.js';
import authReducer from './auth/authSlice.js';

export const store = configureStore({
    reducer: {
        lecture: lectureReducer,
        auth: authReducer,
        // 다른 slice들...
    },
});

export default store;