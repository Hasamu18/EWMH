import { ShippingOrderDetails_OrderItem } from "@/models/ShippingOrderDetails";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ShippingOrderDetailsModalState = {
  isOpen: boolean;
  shippingOrderItem: ShippingOrderDetails_OrderItem | undefined;
};
const initialState: ShippingOrderDetailsModalState = {
  isOpen: false,
  shippingOrderItem: undefined,
};

const shippingOrderDetailsModalSlice = createSlice({
  name: "shippingOrderDetailsModal",
  initialState,
  reducers: {
    setShippingOrderDetailsModalState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setShippingOrderItem(
      state,
      action: PayloadAction<ShippingOrderDetails_OrderItem>
    ) {
      state.shippingOrderItem = action.payload;
    },
  },
});

export const { setShippingOrderDetailsModalState, setShippingOrderItem } =
  shippingOrderDetailsModalSlice.actions;
export default shippingOrderDetailsModalSlice.reducer;
