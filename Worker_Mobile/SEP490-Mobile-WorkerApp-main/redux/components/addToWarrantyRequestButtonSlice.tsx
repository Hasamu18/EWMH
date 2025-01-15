import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AddToWarrantyRequestButtonState = {
  requestId: string;
};
const initialState: AddToWarrantyRequestButtonState = {
  requestId: "",
};

const addToWarranyRequestButtonSlice = createSlice({
  name: "addToWarranyRequestButton",
  initialState,
  reducers: {
    setRequestId(state, action: PayloadAction<string>) {
      state.requestId = action.payload;
    },
  },
});

export const { setRequestId } = addToWarranyRequestButtonSlice.actions;
export default addToWarranyRequestButtonSlice.reducer;
