import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReplacementReasonModalState = {
  isOpen: boolean;
  requestId: string;
  productId: string;
  quantity: number;
};
const initialState: ReplacementReasonModalState = {
  isOpen: false,
  requestId: "",
  productId: "",
  quantity: 0,
};

const replacementReasonModalSlice = createSlice({
  name: "replacementReasonModal",
  initialState,
  reducers: {
    setReplacementReasonModalState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setRequestId(state, action: PayloadAction<string>) {
      state.requestId = action.payload;
    },
    setProductId(state, action: PayloadAction<string>) {
      state.productId = action.payload;
    },
    setProductQuantity(state, action: PayloadAction<number>) {
      state.quantity = action.payload;
    },
  },
});

export const {
  setReplacementReasonModalState,
  setRequestId,
  setProductId,
  setProductQuantity,
} = replacementReasonModalSlice.actions;
export default replacementReasonModalSlice.reducer;
