// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import lectureReducer from './lecture/lectureStore.js';

export const store = configureStore({
    reducer: {
        lecture: lectureReducer,
        // 다른 slice들...
    },
});

export default store;