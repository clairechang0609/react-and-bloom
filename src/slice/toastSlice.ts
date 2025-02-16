import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Toast } from "../types/toast";

export const toastSlice = createSlice({
  name: "toast",
  initialState: {
    text: '',
    type: '',
    id: ''
  },
  reducers: {
    setMessage(state, action) {
      return action.payload;
    }
  }
});

export const asyncSetMessage = createAsyncThunk(
  'toast/createAsyncMessage',
  (payload: Toast, { dispatch, requestId }) => {
    dispatch(toastSlice.actions.setMessage({
      ...payload,
      id: requestId
    }));
  }
);

export const { setMessage } = toastSlice.actions;
export default toastSlice.reducer;
