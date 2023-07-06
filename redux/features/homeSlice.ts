import { createSlice } from "@reduxjs/toolkit";

interface HomeState {
  // data is loaded and page is ready to display
  pageReady: boolean;
}

const homeSlice = createSlice({
  name: "home",
  initialState: {
    pageReady: false,
  } as HomeState,
  reducers: {
    setPageReady: (state, action) => ({ ...state, pageReady: action.payload }),
  },
});

export const { setPageReady } = homeSlice.actions;
export default homeSlice.reducer;
