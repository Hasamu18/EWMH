import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CapturePreRepairEvidenceScreenState = {
  imageUri: string | undefined;
  isPreviewVisible: boolean;
  requestId: string | undefined;
  preRepairImages: string[];
  isRecapture: boolean;
};
const initialState: CapturePreRepairEvidenceScreenState = {
  imageUri: undefined,
  isPreviewVisible: false,
  requestId: undefined,
  preRepairImages: [],
  isRecapture: false,
};

const capturePreRepairEvidenceScreenSlice = createSlice({
  name: "capturePreRepairEvidenceScreen",
  initialState,
  reducers: {
    setImageUri(state, action: PayloadAction<string | undefined>) {
      state.imageUri = action.payload;
    },
    setPreviewVisibility(state, action: PayloadAction<boolean>) {
      state.isPreviewVisible = action.payload;
    },
    setRequestId(state, action: PayloadAction<string | undefined>) {
      state.requestId = action.payload;
    },
    setRecapture(state, action: PayloadAction<boolean>) {
      state.isRecapture = action.payload;
    },
    addPreRepairImage(state, action: PayloadAction<string>) {
      state.preRepairImages.push(action.payload);
    },
    removePreRepairImageByIndex(state, action: PayloadAction<number>) {
      if (
        action.payload >= 0 &&
        action.payload < state.preRepairImages.length
      ) {
        state.preRepairImages.splice(action.payload, 1);
      }
    },
    resetPreRepairEvidence(state) {
      state.isPreviewVisible = false;
      state.imageUri = undefined;
    },
    cleanupAfterSubmission(state) {
      state.preRepairImages = [];
    },
  },
});

export const {
  setImageUri,
  setPreviewVisibility,
  setRequestId,
  setRecapture,
  resetPreRepairEvidence,
  addPreRepairImage,
  removePreRepairImageByIndex,
  cleanupAfterSubmission,
} = capturePreRepairEvidenceScreenSlice.actions;
export default capturePreRepairEvidenceScreenSlice.reducer;
