import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FinishWarrantyRequestModalState = {
  isOpen: boolean;
  conclusion: string;
  isTextInvalid: boolean;
};
const initialState: FinishWarrantyRequestModalState = {
  isOpen: false,
  conclusion: "",
  isTextInvalid: false,
};

const finishWarrantyRequestModalSlice = createSlice({
  name: "finishWarrantyRequestModal",
  initialState,
  reducers: {
    setFinishWarrantyRequestModalState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setConclusion(state, action: PayloadAction<string>) {
      state.conclusion = action.payload;
    },
    setIsTextInvalid(state, action: PayloadAction<boolean>) {
      state.isTextInvalid = action.payload;
    },
  },
});

export const {
  setFinishWarrantyRequestModalState,
  setConclusion,
  setIsTextInvalid,
} = finishWarrantyRequestModalSlice.actions;
export default finishWarrantyRequestModalSlice.reducer;
