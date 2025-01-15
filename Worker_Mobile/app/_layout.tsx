import Colors from "@/constants/Colors";
import { CustomAlertDialogProvider } from "@/redux/providers/CustomAlertDialogProvider";
import { IsLoadingProvider } from "@/redux/providers/IsLoadingProvider";
import { ModalProvider } from "@/redux/providers/ModalProvider";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
  setExponentPushToken,
  setNotification,
} from "@/redux/components/pushNotificationSlice";
import { registerForPushNotificationsAsync } from "@/utils/PushNotificationUtils";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Icon, IconButton, NativeBaseProvider } from "native-base";
import { ReactNode, useEffect, useRef } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { HeaderBarProvider } from "../redux/providers/HeaderBarProvider";
import store from "../redux/store";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.ewmh.background }}>
      <Provider store={store}>
        <CustomAlertDialogProvider>
          <IsLoadingProvider>
            <ModalProvider>
              <HeaderBarProvider>
                <NativeBaseProvider>
                  <RootLayoutNav />
                </NativeBaseProvider>
              </HeaderBarProvider>
            </ModalProvider>
          </IsLoadingProvider>
        </CustomAlertDialogProvider>
      </Provider>
    </SafeAreaView>
  );
}

function RootLayoutNav() {
  const toPreviousPage = () => {
    router.back();
  };
  const dispatch = useDispatch();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const backButton = (): ReactNode => {
    return (
      <IconButton
        size="lg"
        icon={<Icon as={Ionicons} name="arrow-back-outline" />}
        _icon={{ color: Colors.ewmh.foreground }}
        color={Colors.ewmh.foreground}
        onPress={toPreviousPage}
      />
    );
  };
  const setupPushNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      dispatch(setExponentPushToken(token ?? ""));
      console.log("Current token: ", token);
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          dispatch(setNotification(notification));
          console.log("Current notification: ", notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
    } catch (error) {
      dispatch(setExponentPushToken(`${error}`));
    }
  };
  const detachPushNotifications = () => {
    notificationListener.current &&
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    responseListener.current &&
      Notifications.removeNotificationSubscription(responseListener.current);
  };
  useEffect(() => {
    setupPushNotifications();
    return () => {
      detachPushNotifications();
    };
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="index" //login screen.
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{
          title: "Quên mật khẩu",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
        // options={
        //   getHeaderOptions('Quên mật khẩu',backButton,undefined)
      />
      <Stack.Screen
        name="resetPassword"
        options={{
          title: "Đặt lại mật khẩu",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />

      <Stack.Screen
        name="myLeader"
        options={{
          title: "Trưởng nhóm của tôi",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="completedRequests"
        options={{
          title: "Lịch sử yêu cầu",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="products"
        options={{
          title: "Vật tư điện nước",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="warrantyCards"
        options={{
          title: "Thẻ bảo hành của khách",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="warrantyCardDetails"
        options={{
          title: "Chi tiết thẻ bảo hành",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="productDetails"
        options={{
          title: "Chi tiết sản phẩm",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          title: "Thanh toán",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="updateProfile"
        options={{
          title: "Cập nhật thông tin cá nhân",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="postCheckout"
        options={{
          title: "Hoàn thành thanh toán",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => null, // Hides the back button
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="completedRequestDetails"
        options={{
          title: "Chi tiết yêu cầu",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="shippingOrderDetails"
        options={{
          title: "Chi tiết vận đơn",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="captureProofOfDelivery"
        options={{
          title: "Xác nhận giao hàng",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="capturePreRepairEvidence"
        options={{
          title: "Hình trước sửa chữa",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="capturePostRepairEvidence"
        options={{
          title: "Hình sau sửa chữa",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="preRepairEvidenceViewer"
        options={{
          title: "Hình trước sửa chữa",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="postRepairEvidenceViewer"
        options={{
          title: "Nghiệm thu & Bằng chứng",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
      <Stack.Screen
        name="documentScanner"
        options={{
          title: "Quét tài liệu",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          headerLeft: () => backButton(),
        }}
      />
    </Stack>
  );
}
