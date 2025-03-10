import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { setIsFullPageLoading } from '../slice/loadingSlice';
import { CartItem } from "../types/cart";

import { asyncSetMessage } from "./toastSlice";
import { CouponItem } from "../types/coupon";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: <CartItem[]>[],
    coupon: <CouponItem | null>null,
    total: 0,
    final_total: 0
  },
  reducers: {
    setCart(state, action) {
      state.cart = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    setFinalTotal(state, action) {
      state.final_total = action.payload;
    },
    setCoupon(state, action) {
      state.coupon = action.payload;
    }
  }
})

export const asyncGetCart = createAsyncThunk<void, void | { isShowLoading?: boolean }>(
  'cart/asyncGetCart',
  async ({ isShowLoading = true } = {}, { dispatch, requestId: _requestId }) => {
    try {
      if (isShowLoading) {
        dispatch(setIsFullPageLoading(true));
      }
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      dispatch(setCart(res.data.data?.carts));
      dispatch(setTotal(res.data.data?.total));
      dispatch(setFinalTotal(res.data.data?.final_total));
      if (res.data.data?.carts.length) {
        dispatch(setCoupon(res.data.data?.carts[0].coupon));
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  }
)

export const asyncAddCart = createAsyncThunk(
  'cart/asyncAddCart',
  async (payload: { productId?: string, qty?: number }, { dispatch, requestId: _requestId }) => {
    try {
      dispatch(setIsFullPageLoading(true));
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, {
        data: {
          product_id: payload.productId,
          qty: payload.qty || 1
        }
      });
      dispatch(asyncSetMessage({ text: res?.data.message, type: 'success' }));
      await dispatch(asyncGetCart());
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.message);
        dispatch(asyncSetMessage({ text: err?.response?.data.message, type: 'danger' }));
      }
    } finally {
      dispatch(setIsFullPageLoading(false));
    }
  }
)

export const { setCart, setTotal, setFinalTotal, setCoupon } = cartSlice.actions;
export const cartData = (state: { cart: ReturnType<typeof cartSlice.getInitialState> }) => state.cart;
export default cartSlice.reducer;
