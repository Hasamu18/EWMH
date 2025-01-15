import { View, Text, SafeAreaView, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import FormField from '@/components/custom_components/FormField'
import CustomButton from '@/components/custom_components/CustomButton'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth' 
import { useGlobalState } from '@/context/GlobalProvider'

const ForgetPassword = () => {
  const { handleResetPassword, emailError } = useAuth();
  const { loading, setLoading } = useGlobalState();

  const [form, setForm] = useState({
    email: "",
  });

  const submit = async () => {
    setLoading(true);
    try {
      const response = await handleResetPassword({ email: form.email });

      if (response) {
        Alert.alert('Đã gửi link', 'Kiểm tra mail để đổi mật khẩu');
        router.back();
      }
    } catch (error) {
      console.error("Error during password reset:", error);
    } finally {
      setLoading(false);
    }
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
        <Text className="text-3xl font-semibold text-center">Bạn Đã Quên Mật Khẩu?</Text>
        <Text className="text-xl text-gray-500 text-center">Hãy Nhập Email Của Bạn Để Cài Lại Mật Khẩu.</Text>
      </View>
      <FormField
        title="Địa chỉ Email"
        value={form.email}
        handleChangeText={(e: string) => setForm({ ...form, email: e })}
        placeholder="Nhập địa chỉ Email"
        otherStyles="mt-7 "
        keyboardType="email-address"
        icon={<AntDesign name="mail" size={24} color="black" />}
      />
      {emailError ? <Text className="text-red-500 absolute top-[233px] font-bold left-4 ">{emailError}</Text> : null}

      <CustomButton
        title="Xác nhận Email"
        handlePress={submit}
        containerStyles="mt-7 mt-14"
        isLoading={loading}
      />
    </SafeAreaView>
  );
}

export default ForgetPassword;
