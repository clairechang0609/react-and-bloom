import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import cartSlice from "./slice/cartSlice";
import loadingSlice from "./slice/loadingSlice";
import toastReducer from "./slice/toastSlice";

export const store = configureStore({
  reducer: { // 必要加入 reducer
    toast: toastReducer,
    loading: loadingSlice,
    cart: cartSlice
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

