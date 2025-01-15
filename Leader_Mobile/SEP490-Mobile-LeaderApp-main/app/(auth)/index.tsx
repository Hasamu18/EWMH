import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/custom_components/FormField";
import CustomButton from "@/components/custom_components/CustomButton";
import { ActivityIndicator, Text, View } from "react-native";
import { Checkbox } from "@ant-design/react-native";
import { Octicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useGlobalState } from "@/context/GlobalProvider";
import * as SecureStore from "expo-secure-store";


const SignIn = () => {
  const [isRemembered, setIsRemembered] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { loading } = useGlobalState();
  const { handleLogin, phoneEmailError, passwordError } = useAuth();


  // Load saved email and password if available
  useEffect(() => {
    const loadCredentials = async () => {
      const savedEmail = await SecureStore.getItemAsync("email");
      const savedPassword = await SecureStore.getItemAsync("password");
      if (savedEmail && savedPassword) {
        setForm({ email: savedEmail, password: savedPassword });
        setIsRemembered(true);
      }
    };
    loadCredentials();

  }, []);

  const submit = async () => {
    if (isRemembered) {
      // Save credentials to SecureStore if "remember me" is checked
      await SecureStore.setItemAsync("email", form.email);
      await SecureStore.setItemAsync("password", form.password);
    } else {
      // Clear stored credentials if "remember me" is unchecked
      await SecureStore.deleteItemAsync("email");
      await SecureStore.deleteItemAsync("password");
    }

    await handleLogin(form.email, form.password);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="w-full h-full mt-20 px-4">
      <View className="mb-10">
        <Text className="text-3xl font-semibold text-center mb-5">
          Xin chào bạn,
        </Text>
        <Text className="text-xl text-gray-400 text-center">
          Hãy Đăng Nhập Để Quản Lí Công Việc
        </Text>
      </View>

      <FormField
        title="SĐT/Email"
        value={form.email}
        handleChangeText={(e: string) => setForm({ ...form, email: e })}
        placeholder="Nhập SĐT/Email"
        otherStyles="mt-7"
        icon={<Octicons name="person" size={24} color="black" />}
      />
      {phoneEmailError ? (
        <Text className="text-red-500 absolute top-[270px] font-bold left-4">
          {phoneEmailError}
        </Text>
      ) : null}

      <FormField
        title="Mật khẩu"
        value={form.password}
        handleChangeText={(e: string) => setForm({ ...form, password: e })}
        placeholder="Nhập mật khẩu"
        otherStyles="mt-10"
      />
      {passwordError ? (
        <Text className="text-red-500 absolute font-bold top-[410px] left-4">
          {passwordError}
        </Text>
      ) : null}

      <View className="flex-row justify-between mt-14">
        <View className="flex-row ml-2">
          <Checkbox
            checked={isRemembered}
            onChange={() => setIsRemembered(!isRemembered)}
          />
          <Text className="text-base">Ghi nhớ mật khẩu</Text>
        </View>
        <View>
          <Text
            className="text-blue-700 underline text-base"
            onPress={() => router.push("/(auth)/forget-password")}
          >
            Quên mật khẩu
          </Text>
        </View>
      </View>

      <CustomButton
        title="Đăng nhập"
        handlePress={submit}
        containerStyles="mt-7 mt-14"
        isLoading={loading}
      />
    </SafeAreaView>
  );
};

export default SignIn;
