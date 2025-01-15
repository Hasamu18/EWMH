import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RequestDetailsScreenState = {
  isLoading: boolean;
  preRepairEvidence: string;
  postRepairEvidence: string;
};
const initialState: RequestDetailsScreenState = {
  isLoading: false,
  preRepairEvidence: "",
  postRepairEvidence: "",
};

const requestDetailsScreenSlice = createSlice({
  name: "requestDetailsScreen",
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setPreRepairEvidence(state, action: PayloadAction<string>) {
      state.preRepairEvidence = action.payload;
    },
    setPostRepairEvidence(state, action: PayloadAction<string>) {
      state.postRepairEvidence = action.payload;
    },
  },
});

export const { setIsLoading, setPreRepairEvidence, setPostRepairEvidence } =
  requestDetailsScreenSlice.actions;
export default requestDetailsScreenSlice.reducer;
