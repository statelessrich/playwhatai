import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./features/formSlice";
import homeReducer from "./features/homeSlice";

export const store = configureStore({
	reducer: {
		home: homeReducer,
		form: formReducer,
	},
	devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
