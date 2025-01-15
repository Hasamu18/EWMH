import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CaptureProofOfDeliveryScreenState = {
  imageUri: string | undefined;
  isPreviewVisible: boolean;
};
const initialState: CaptureProofOfDeliveryScreenState = {
  imageUri: undefined,
  isPreviewVisible: false,
};

const captureProofOfDeliveryScreenSlice = createSlice({
  name: "captureProofOfDeliveryScreen",
  initialState,
  reducers: {
    setImageUri(state, action: PayloadAction<string | undefined>) {
      state.imageUri = action.payload;
    },
    setPreviewVisibility(state, action: PayloadAction<boolean>) {
      state.isPreviewVisible = action.payload;
    },
    resetProofOfDelivery(state) {
      state.isPreviewVisible = false;
      state.imageUri = undefined;
    },
  },
});

export const { setImageUri, setPreviewVisibility, resetProofOfDelivery } =
  captureProofOfDeliveryScreenSlice.actions;
export default captureProofOfDeliveryScreenSlice.reducer;
