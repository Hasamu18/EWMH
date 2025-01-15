import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//use this when you dont want actions to refetch/trigger isLoading/isSending of their initial slice state
export const excludedActions = [
  "auth/send/loginVerify",
  "auth/send/registerVerify",
  "auth/send/forgetPasswordVerify",
  "product/fetch/getProduct",
  "servicePackage/fetch/getServicePackage",
  "apartment/fetch/getAllRoomPaginated",
  "account/fetch/getAllFreeLeaders",
  "account/fetch/getAllLeaderPaginatedExcluded",
  "order/fetch/getOrderDetails",
  "feedback/fetch/getFeedbackDetails",
  "request/fetch/getDetailsOfRequest",
  "request/fetch/getCurrentPriceOfRequest",
  "account/fetch/getAllWorkerFromLeader",
  "product/fetch/getRevenueAndNumberOfPurchaseOfProduct",
  "servicePackage/fetch/getRevenueAndNumberOfPurchaseOfServicePackage",
  "dashboard/fetch/getStatistics",
];
export const excludedActionsPending = excludedActions.map(
  (action) => `${action}/pending`,
);

const initialState: TUI = {
  OTPModal: { open: false, extraValues: {} },
  forgotPasswordForm: { step: 1, extraValues: {} },
  isLoading: false,
};

const UISlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setShowOTPModal: (state, action: PayloadAction<TUI["OTPModal"]>) => {
      state.OTPModal = action.payload;
    },
    resetOTPModal: (state) => {
      state.OTPModal = initialState.OTPModal;
    },
    setForgotPasswordForm: (
      state,
      action: PayloadAction<TUI["forgotPasswordForm"]>,
    ) => {
      state.forgotPasswordForm = action.payload;
    },
    resetForgotPasswordForm: (state) => {
      state.forgotPasswordForm = initialState.forgotPasswordForm;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          // "user/login/SUCCESS" => "user/login"
          const baseActionType = action.type.substring(
            0,
            action.type.lastIndexOf("/"),
          );
          return (
            action.type.endsWith("/pending") &&
            excludedActions.includes(baseActionType)
          );
        },
        (state) => {
          state.isLoading = true;
        },
      )
      .addMatcher(
        (action) => {
          const baseActionType = action.type.substring(
            0,
            action.type.lastIndexOf("/"),
          );
          return (
            (action.type.endsWith("/fulfilled") ||
              action.type.endsWith("/rejected")) &&
            excludedActions.includes(baseActionType)
          );
        },
        (state) => {
          state.isLoading = false;
        },
      );
  },
});

export const { setShowOTPModal, resetOTPModal, setForgotPasswordForm } =
  UISlice.actions;

export default UISlice.reducer;

type TUI = {
  OTPModal: { open: boolean; extraValues: object };
  forgotPasswordForm: { step: number; extraValues: object };
  isLoading: boolean;
};
