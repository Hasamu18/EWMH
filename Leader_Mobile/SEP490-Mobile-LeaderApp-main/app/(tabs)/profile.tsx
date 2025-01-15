import { Text, SafeAreaView, View, Image, ActivityIndicator } from "react-native";
import React, { useCallback } from "react";
import ProfileIcon from "@/components/custom_components/ProfileIcon";
import { router, useFocusEffect } from "expo-router";
import RenderOptionItem, { Option } from "@/components/custom_components/RenderOptionItem";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "@/components/custom_components/CustomButton";
import { useLeader } from "@/hooks/useLeader";
import { useGlobalState } from "@/context/GlobalProvider";
import { useAuth } from "@/hooks/useAuth";

const options: Option[] = [
  {
    icon: <MaterialIcons name="edit" size={24} color="black" />,
    title: "Xem danh sách nhân viên",
    route: `/workerList/workerList`,
  },
];

const profile = () => {
  const { handleGetLeaderInfo, userInfo } = useLeader();
  const { loading, setLoading } = useGlobalState();
  const { handleLogOut } = useAuth();

  const logOut = async () => {
    handleLogOut();
  };

  const fetchUserInfo = async () => {
    await handleGetLeaderInfo(); 
  };

  useFocusEffect(
    useCallback(() => {
      if (!userInfo) {
        setLoading(true);
        fetchUserInfo().finally(() => setLoading(false));
      }
    }, [userInfo])
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-col items-center">
        <ProfileIcon
          image={
            userInfo && (userInfo.user || userInfo).avatarUrl
              ? `${(userInfo.user || userInfo).avatarUrl}&timestamp=${new Date().getTime()}`
              : ""
          }
          handlePress={() => router.push(`/profileEdit/profileEdit`)}
        />
        <Text numberOfLines={1} ellipsizeMode="tail" className="font-bold text-xl">
        {(userInfo && (userInfo.user || userInfo).fullName) || "User"}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" className="text-base text-gray-500">
        {(userInfo && (userInfo.user || userInfo).email) || "Email"}
        </Text>
      </View>
      <View className="mt-5">
        <Text className="mb-2 text-center text-lg">
          Thông tin chung cư quản lí
        </Text>
        <View className="mx-3 bg-[#DBE2EF] w-fit flex-row p-2 rounded-xl items-center self-center">
  <Image
    source={{
      uri: userInfo?.apartment?.[0]?.avatarUrl
        ? `${userInfo.apartment[0].avatarUrl}&timestamp=${new Date().getTime()}`
        : "",
    }}
    className="w-14 h-14 rounded-full mr-2"
  />
  <View>
    <Text className="text-base font-bold">
      {userInfo?.apartment?.[0]?.managementCompany || "Chưa có công ti chung cư"}
    </Text>
    <Text>
      {userInfo?.apartment?.[0]?.name || "Chưa có chung cư"}
    </Text>
    <Text numberOfLines={1} ellipsizeMode="tail">
      {userInfo?.apartment?.[0]?.address || "Chưa có  địa chỉ chung cư"}
    </Text>
  </View>
</View>
      </View>
      <Text className="bg-[#DBE2EF] text-[#5F60B9] p-4 text-xl font-bold w-full mt-6">
        Thông tin chung
      </Text>
      <View className="h-96">
        <RenderOptionItem options={options} />
      </View>
      <CustomButton
        title="Đăng xuất"
        textStyles="text-sm"
        containerStyles="mx-2"
        handlePress={logOut}
      />
    </SafeAreaView>
  );
};

export default profile;
