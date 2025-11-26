import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allVideos: [],
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    getVideos: (state, action) => {
      state.allVideos = action.payload;
    },
  },
});

export const { getVideos } = videoSlice.actions;

export default videoSlice.reducer;
