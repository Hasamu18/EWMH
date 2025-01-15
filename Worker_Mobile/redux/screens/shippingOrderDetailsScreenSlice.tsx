import { ShippingOrder } from "@/models/ShippingOrder";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ShippingOrderDetailsScreenState = {
  shippingOrder: ShippingOrder | undefined;
  isLoading: boolean;
};
const initialState: ShippingOrderDetailsScreenState = {
  shippingOrder: undefined,
  isLoading: true,
};

const shippingOrderDetailsScreenSlice = createSlice({
  name: "shippingOrderDetailsScreen",
  initialState,
  reducers: {
    setShippingOrder(state, action: PayloadAction<ShippingOrder>) {
      state.shippingOrder = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setShippingOrder, setIsLoading } =
  shippingOrderDetailsScreenSlice.actions;
export default shippingOrderDetailsScreenSlice.reducer;
