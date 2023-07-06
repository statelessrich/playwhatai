import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./features/homeSlice";
import formReducer from "./features/formSlice";
import { AnyAction } from "redux";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    form: formReducer,
    devTools: (state: boolean = process.env.NODE_ENV !== "production", action: AnyAction) => state,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
