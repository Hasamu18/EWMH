import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PostCheckoutScreenState = {
  isLoading: boolean;
  requestId: string;
};
const initialState: PostCheckoutScreenState = {
  isLoading: false,
  requestId: "",
};

const postCheckoutScreenSlice = createSlice({
  name: "postCheckoutScreen",
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setRequestId(state, action: PayloadAction<string>) {
      state.requestId = action.payload;
    },
  },
});

export const { setIsLoading, setRequestId } = postCheckoutScreenSlice.actions;
export default postCheckoutScreenSlice.reducer;
