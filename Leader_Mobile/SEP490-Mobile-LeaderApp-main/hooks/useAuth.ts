import useAxios from "@/utils/useUserAxios";
import { validateEmail, validatePhone } from "@/utils/utils";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useGlobalState } from "@/context/GlobalProvider";
import { Alert } from "react-native";
import { useNotification } from "./useNotification";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import * as SecureStore from "expo-secure-store";




export function useAuth() {
  const { fetchData, error, setError } = useAxios();
  const { setLoading } = useGlobalState();
  const {configureNotifications, getExpoPushTokenAsync, fetchNotifications, AddPushNotificationRecord} = useNotification()
  const [emailError, setEmailError] = useState('');
  const [phoneEmailError, setPhoneEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [expirationTimeout, setExpirationTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error === "Người dùng không tồn tại") {
      Alert.alert("Sai Email hay mật khẩu", "Xin hãy thử lại");
      setError("");
    }
  }, [error]);

  const handleLogin = async (emailOrPhone: string, password: string) => {
    setPhoneEmailError('');
    setPasswordError('');
  
    if (!emailOrPhone) {
      setPhoneEmailError('SĐT/Email không được để trống');
      return;
    }
    if (!validatePhone(emailOrPhone) && !validateEmail(emailOrPhone)) {
      setPhoneEmailError('SĐT hoặc Email không hợp lệ');
      return;
    }
    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      return;
    }
  
    setLoading(true);
    const response = await fetchData({
      url: "/account/1",
      method: "POST",
      data: {
        email_Or_Phone: emailOrPhone,
        password: password,
      },
    });
  
    if (response) {
      const { at, rt } = response;
      await SecureStore.deleteItemAsync("orders");
      await SecureStore.setItemAsync("accessToken", at);
      await SecureStore.setItemAsync("refreshToken", rt);
      const decode = jwtDecode(at) as any;
      await SecureStore.setItemAsync('accountId', decode.accountId);

  
      setTokenRenewal(decode.exp);
  
      setLoading(false);
  
      if (decode.role !== "LEADER") {
        Alert.alert("Sai Email hay mật khẩu", "Xin hãy thử lại");
        return;
      }
      console.log("isDevice", Device.isDevice)
  
      // Check for device compatibility
      if (!Device.isDevice) {
        Alert.alert("Không thể nhận thông báo", "Thông báo chỉ hoạt động trên thiết bị thực.");
      } else {
        const { status } = await Notifications.getPermissionsAsync();
        console.log("Status",status)
        if (status !== 'granted') {
          const permission = await Notifications.requestPermissionsAsync();
          if (permission.status !== 'granted') {
            await Notifications.getPermissionsAsync();
            return;
          }
        }
  
        // Configure notifications and save token
        await configureNotifications();
        const token = await getExpoPushTokenAsync();
        
        const accountId = await SecureStore.getItemAsync('accountId');

  
        // await AddPushNotificationRecord({
        //   leaderId: accountId || "",
        //   date: new Date().toISOString(),
        //   exponentPushToken: token || "",
        // });
  
        // Fetch notifications
        await fetchNotifications();
      }
  
      // Navigate to home page
      router.replace('/(tabs)/home');
    } else {
      setLoading(false);
      console.error("Login failed", response.message || error);
    }
  };

  const handleResetPassword = async (data: { email: string }) => {
    setEmailError(''); // Clear previous errors
    if (!data.email) {
      setEmailError('Email không được để trống');
      return; // Exit if email is empty
    }
    if (!validateEmail(data.email)) {
      setEmailError('Địa chỉ Email không hợp lệ');
      return; // Exit if email is invalid
    }

    try {
      const response = await fetchData({
        url: "/account/8", // Reset password endpoint
        method: "POST",
        data: data,
      });

      if (response) {
        return response;
      } else {
        setEmailError('Đã xảy ra lỗi khi gửi email. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setEmailError('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleLogOut = async () => {
    if (expirationTimeout) clearTimeout(expirationTimeout);
    setLoading(true);
    const response = await fetchData({
      url: "/account/12",
      method: "POST",
    });

    if (response) {
      router.replace("/");
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken")
      await SecureStore.deleteItemAsync('accountId');
      await SecureStore.deleteItemAsync("orders");
      setLoading(false);
    } else {
      console.log(error);
      setLoading(false);
    }
  };

  const setTokenRenewal = (exp: number) => {
    const expirationTime = exp * 1000 - Date.now() - 60000;
    const timeoutId = setTimeout(async () => {
      
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const response = await fetchData({
        url: "/account/11",
        method: "POST",
        data: {
           at: accessToken,
           rt: refreshToken 
        },
      });

      if (response) {
        const { at, rt } = response;
        await SecureStore.setItemAsync("accessToken", at);
        await SecureStore.setItemAsync("refreshToken", rt);
        
        const decode = jwtDecode(at) as any;
        setTokenRenewal(decode.exp); 
      } else {
        Alert.alert("Đã đăng xuất", "Đã đăng xuất không có hoạt động từ bạn");
        handleLogOut();
      }
    }, expirationTime);

    setExpirationTimeout(timeoutId);
  };

  return {
    handleResetPassword,
    handleLogOut,
    handleLogin,
    phoneEmailError,
    emailError,
    passwordError,
  };
}
