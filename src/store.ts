import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slice/toastSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: { // 必要加入 reducer
    toast: toastReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
