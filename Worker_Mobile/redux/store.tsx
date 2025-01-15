// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import addToWarranyRequestButtonSlice from "./components/addToWarrantyRequestButtonSlice";
import cancelRequestModalSlice from "./components/cancelRequestModalSlice";
import choosePaymentMethodModalSlice from "./components/choosePaymentMethodModalSlice";
import customAlertDialogSlice from "./components/customAlertDialogSlice";
import editReplacementReasonModalSlice from "./components/editReplacementReasonModalSlice";
import finishWarrantyRequestModalSlice from "./components/finishWarrantyRequestModalSlice";
import productSearchSlice from "./components/productSearchSlice";
import pushNotificationSlice from "./components/pushNotificationSlice";
import replacementReasonModalSlice from "./components/replacementReasonModalSlice";
import shippingOrderDetailsModalSlice from "./components/shippingOrderDetailsModalSlice";
import updateProfileSlice from "./components/updateProfileSlice";
import warrantySearchSlice from "./components/warrantySearchSlice";
import capturePreRepairEvidenceScreenSlice from "./screens/capturePreRepairEvidenceScreenSlice";
import captureProofOfDeliveryScreenSlice from "./screens/captureProofOfDeliveryScreenSlice";
import homeScreenSlice from "./screens/homeScreenSlice";
import postCheckoutScreenSlice from "./screens/postCheckoutScreenSlice";
import requestDetailsScreenSlice from "./screens/requestDetailsScreenSlice";
import shippingOrderDetailsScreenSlice from "./screens/shippingOrderDetailsScreenSlice";
import warrantyRequestDetailsScreenSlice from "./screens/warrantyRequestDetailsScreenSlice";
import capturePostRepairEvidenceScreenSlice from "./screens/capturePostRepairEvidenceScreenSlice";
const store = configureStore({
  reducer: {
    productSearch: productSearchSlice,
    replacementReasonModal: replacementReasonModalSlice,
    editReplacementReasonModal: editReplacementReasonModalSlice,
    choosePaymentMethodModal: choosePaymentMethodModalSlice,
    updateProfile: updateProfileSlice,
    customAlertDialog: customAlertDialogSlice,
    homeScreen: homeScreenSlice,
    requestDetailsScreen: requestDetailsScreenSlice,
    warrantyRequestDetailsScreen: warrantyRequestDetailsScreenSlice,
    warrantyCardSearch: warrantySearchSlice,
    finishWarrantyRequestModal: finishWarrantyRequestModalSlice,
    postCheckoutScreen: postCheckoutScreenSlice,
    cancelRequestModal: cancelRequestModalSlice,
    addToWarranyRequestButton: addToWarranyRequestButtonSlice,
    pushNotification: pushNotificationSlice,
    shippingOrderDetailsScreen: shippingOrderDetailsScreenSlice,
    shippingOrderDetailsModal: shippingOrderDetailsModalSlice,
    captureProofOfDeliveryScreen: captureProofOfDeliveryScreenSlice,
    capturePreRepairEvidenceScreen: capturePreRepairEvidenceScreenSlice,
    capturePostRepairEvidenceScreen: capturePostRepairEvidenceScreenSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
