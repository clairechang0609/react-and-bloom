import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isFullPageLoading: false
  },
  reducers: {
    setIsFullPageLoading(state, action) {
      state.isFullPageLoading = action.payload;
    }
  }
});

export const { setIsFullPageLoading } = loadingSlice.actions;
export const loadingData = (state: { loading: ReturnType<typeof loadingSlice.getInitialState> }) => state.loading;
export default loadingSlice.reducer;
