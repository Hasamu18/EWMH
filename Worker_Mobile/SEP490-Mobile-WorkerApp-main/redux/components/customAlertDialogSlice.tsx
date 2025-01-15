import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CustomAlertDialogProps = {
  header: string;
  body: string;
  cancelText?: string;
  proceedText: string;
  isShowing?: boolean;    
};
const initialState: CustomAlertDialogProps = {
  header: "",
  body: "",
  proceedText: "",
  isShowing: false,
};

const customAlertDialogSlice = createSlice({
  name: "customAlertDialog",
  initialState,
  reducers: {
    setHeader(state, action: PayloadAction<string>) {
      state.header = action.payload;
    },
    setBody(state, action: PayloadAction<string>) {
      state.header = action.payload;
    },
    // setFunctionName(state, action: PayloadAction<string>) {
    //   state.functionName = action.payload;
    // },
    setProceedText(state, action: PayloadAction<string>) {
      state.proceedText = action.payload;
    },
    setCancelText(state, action: PayloadAction<string>) {
      state.cancelText = action.payload;
    },
    showModal(state, action: PayloadAction<CustomAlertDialogProps>) {
      state.isShowing = true;
      state.header = action.payload.header;
      state.body = action.payload.body;
      state.proceedText = action.payload.proceedText;
      state.cancelText = action.payload.cancelText;      
    },
    hideModal(state) {
      state.isShowing = false;
    },
  },
});

export const {
  setHeader,
  setBody,
  setProceedText,
  setCancelText,
  showModal,
  hideModal,
} = customAlertDialogSlice.actions;
export default customAlertDialogSlice.reducer;
