import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CancelRequestModalState = {
  isOpen: boolean;
  requestId: string;
};
const initialState: CancelRequestModalState = {
  isOpen: false,
  requestId: "",
};

const cancelRequestModalSlice = createSlice({
  name: "cancelRequestModal",
  initialState,
  reducers: {
    setCancelRequestModalState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setRequestId(state, action: PayloadAction<string>) {
      state.requestId = action.payload;
    },
  },
});

export const { setCancelRequestModalState, setRequestId } =
  cancelRequestModalSlice.actions;
export default cancelRequestModalSlice.reducer;
