import { OFFLINE_PAYMENT } from "@/constants/PaymentMethods";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChoosePaymentMethodModalState = {
  isOpen: boolean;
  requestId: string;
  paymentMethod: string;
  conclusion: string;
  isTextInvalid: boolean;
};
const initialState: ChoosePaymentMethodModalState = {
  isOpen: false,
  paymentMethod: OFFLINE_PAYMENT,
  requestId: "",
  conclusion: "",
  isTextInvalid: false,
};

const choosePaymentMethodModalSlice = createSlice({
  name: "choosePaymentMethodModal",
  initialState,
  reducers: {
    setChoosePaymentMethodModalState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethod = action.payload;
    },
    setRequestId(state, action: PayloadAction<string>) {
      state.requestId = action.payload;
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
  setChoosePaymentMethodModalState,
  setPaymentMethod,
  setRequestId,
  setConclusion,
  setIsTextInvalid,
} = choosePaymentMethodModalSlice.actions;
export default choosePaymentMethodModalSlice.reducer;
