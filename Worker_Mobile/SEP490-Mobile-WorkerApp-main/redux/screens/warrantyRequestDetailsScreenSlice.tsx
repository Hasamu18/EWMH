import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WarrantyRequestDetailsScreenState = {
  isLoading: boolean;
  requestId: string;
};
const initialState: WarrantyRequestDetailsScreenState = {
  isLoading: false,
  requestId:""
};

const warrantyRequestDetailsScreenSlice = createSlice({
  name: "warrantyRequestDetailsScreen",
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

export const { setIsLoading, setRequestId } =
  warrantyRequestDetailsScreenSlice.actions;
export default warrantyRequestDetailsScreenSlice.reducer;
