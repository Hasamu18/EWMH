import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";
type PushNotificationState = {
  exponentPushToken: string;
  notification: Notifications.Notification | undefined;
};
const initialState: PushNotificationState = {
  exponentPushToken: "",
  notification: undefined,
};

const pushNotificationSlice = createSlice({
  name: "pushNotification",
  initialState,
  reducers: {
    setExponentPushToken(state, action: PayloadAction<string>) {
      state.exponentPushToken = action.payload;
    },
    setNotification(state, action: PayloadAction<Notifications.Notification>) {
      state.notification = action.payload;
    },
  },
});

export const { setExponentPushToken, setNotification } =
  pushNotificationSlice.actions;
export default pushNotificationSlice.reducer;
