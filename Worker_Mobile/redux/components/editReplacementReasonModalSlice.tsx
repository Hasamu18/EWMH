import { ReplacementProduct } from "@/models/RequestDetails";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EditReplacementReasonModalState = {
  isOpen: boolean;
  replacementProduct: ReplacementProduct;
  isTextInvalid: boolean;
};
const initialState: EditReplacementReasonModalState = {
  isOpen: false,
  replacementProduct: {
    requestDetailId: "",
    requestId: "",
    imageUrl: "",
    productName: "",
    productPrice: 0,
    isCustomerPaying: false,
    quantity: 0,
    replacementReason: "",
  },
  isTextInvalid: false,
};

const editReplacementReasonModalSlice = createSlice({
  name: "editReplacementReasonModal",
  initialState,
  reducers: {
    setEditReplacementReasonModalState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setEditReplacementProduct(
      state,
      action: PayloadAction<ReplacementProduct>
    ) {
      state.replacementProduct = action.payload;
    },
    setEditReplacementProductQuantity(state, action: PayloadAction<number>) {
      state.replacementProduct.quantity = action.payload;
    },
    setEditReplacementProductIsCustomerPaying(
      state,
      action: PayloadAction<boolean>
    ) {
      state.replacementProduct.isCustomerPaying = action.payload;
    },
    setEditReplacementProductReplacementReason(
      state,
      action: PayloadAction<string>
    ) {
      state.replacementProduct.replacementReason = action.payload;
    },
    setIsTextInvalid(state, action: PayloadAction<boolean>) {
      state.isTextInvalid = action.payload;
    },
  },
});

export const {
  setEditReplacementReasonModalState,
  setEditReplacementProduct,
  setEditReplacementProductQuantity,
  setEditReplacementProductIsCustomerPaying,
  setEditReplacementProductReplacementReason,
  setIsTextInvalid,
} = editReplacementReasonModalSlice.actions;
export default editReplacementReasonModalSlice.reducer;
