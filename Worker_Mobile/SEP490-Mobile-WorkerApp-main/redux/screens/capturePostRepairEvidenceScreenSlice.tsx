import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CapturePostRepairEvidenceScreenState = {
  imageUri: string | undefined;
  isPreviewVisible: boolean;
  requestId: string | undefined;
  acceptanceReportImages: string[];
  repairCompletedImages: string[];
  isRecapture: boolean;
};
const initialState: CapturePostRepairEvidenceScreenState = {
  imageUri: undefined,
  isPreviewVisible: false,
  requestId: undefined,
  acceptanceReportImages: [],
  repairCompletedImages: [],
  isRecapture: false,
};

const capturePostRepairEvidenceScreenSlice = createSlice({
  name: "capturePostRepairEvidenceScreen",
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
    addAcceptanceReportImage(state, action: PayloadAction<string>) {
      state.acceptanceReportImages.push(action.payload);
    },
    removeAcceptanceReportImageByIndex(state, action: PayloadAction<number>) {
      if (
        action.payload >= 0 &&
        action.payload < state.acceptanceReportImages.length
      ) {
        state.acceptanceReportImages.splice(action.payload, 1);
      }
    },
    addRepairCompletedImage(state, action: PayloadAction<string>) {
      state.repairCompletedImages.push(action.payload);
    },
    removeRepairCompletedImageByIndex(state, action: PayloadAction<number>) {
      if (
        action.payload >= 0 &&
        action.payload < state.repairCompletedImages.length
      ) {
        state.repairCompletedImages.splice(action.payload, 1);
      }
    },
    resetPostRepairEvidence(state) {
      state.isPreviewVisible = false;
      state.imageUri = undefined;
    },
    cleanupAfterSubmission(state) {
      state.acceptanceReportImages = [];
      state.repairCompletedImages = [];
    },
  },
});

export const {
  setImageUri,
  setPreviewVisibility,
  setRequestId,
  setRecapture,
  addAcceptanceReportImage,
  removeAcceptanceReportImageByIndex,
  addRepairCompletedImage,
  removeRepairCompletedImageByIndex,
  resetPostRepairEvidence,
  cleanupAfterSubmission,
} = capturePostRepairEvidenceScreenSlice.actions;
export default capturePostRepairEvidenceScreenSlice.reducer;
