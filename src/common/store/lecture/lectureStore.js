import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchKeyword:'',
    searchType:1,
    page:0
}

const lectureSlice = createSlice({
    name: 'lecture',
    initialState,
    reducers: {
        setSearchKeyword: (state, action) => {
            state.searchKeyword = action.payload;
        },
        setSearchType: (state, action) => {
            state.searchType = action.payload;
            state.page = 0; // 정렬 변경 시 페이지 리셋
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        executeSearch: (state, action) => {
            state.searchKeyword = action.payload;
            state.page = 0; // 검색 실행 시 페이지 리셋
        },
        resetFilters: (state) => {
            state.searchKeyword = '';
            state.searchType = 1;
            state.page = 0;
        }
    }
});

export const {
    setSearchKeyword,
    setSearchType,
    setPage,
    executeSearch,
    resetFilters
} = lectureSlice.actions;

export default lectureSlice.reducer;