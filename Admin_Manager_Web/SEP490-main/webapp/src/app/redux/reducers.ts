import { combineReducers } from "@reduxjs/toolkit";

import uiReducer from "./slice/specialUISlice";
import headerReducer from "./slice/headerSlice.ts";
import authReducer from "./slice/authSlice";
import accountReducer from "./slice/accountSlice.ts";
import productReducer from "./slice/productSlice.ts";
import servicePackageReducer from "./slice/servicePackageSlice.ts";
import apartmentReducer from "./slice/apartmentSlice.ts";
import contractReducer from "./slice/contractSlice.ts";
import requestReducer from "./slice/requestSlice.ts";
import dashboardReducer from "./slice/dashboardSlice.ts";
import orderReducer from "./slice/orderSlice.ts";
import feedbackReducer from "./slice/feedbackSlice.ts";

const rootReducer = combineReducers({
  specialUI: uiReducer,
  header: headerReducer,
  auth: authReducer,
  account: accountReducer,
  product: productReducer,
  servicePackage: servicePackageReducer,
  apartment: apartmentReducer,
  contract: contractReducer,
  request: requestReducer,
  dashboard: dashboardReducer,
  order: orderReducer,
  feedback: feedbackReducer,
});

export default rootReducer;
