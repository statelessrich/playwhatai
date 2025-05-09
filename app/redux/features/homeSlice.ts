import { createSlice } from "@reduxjs/toolkit";
import type { HomeState } from "../../types";

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
