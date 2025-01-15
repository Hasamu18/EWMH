import {
  View,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Notificaton from "@/components/custom_components/Notificaton";
import { FontAwesome } from "@expo/vector-icons";
import RenderRequestItem from "@/components/custom_components/RenderRequestItem";
import { useLeader } from "@/hooks/useLeader";
import { useGlobalState } from "@/context/GlobalProvider";
import { useFocusEffect } from "expo-router";
import { useRequest } from "@/hooks/useRequest";
import { useNotification } from "@/hooks/useNotification";
import { useFakeLoading } from "@/utils/utils";

const Home = () => {
  const { handleGetLeaderInfo, userInfo } = useLeader();
  const { handleGetHomeRequest, homeRequest } = useRequest();
  const { loading, setLoading } = useGlobalState();
  const { fetchNotifications, listenToNotifications } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [fakeLoading, setFakeLoading] = useState(true);
  useFakeLoading(setFakeLoading);

  const fetchUserInfo = async () => {
    await handleGetLeaderInfo();
  };

  const fetchHomeRequest = async () => {
    await handleGetHomeRequest();
  };

  const fetchAllRequests = useCallback(async () => {
    setLoading(true);
    await fetchUserInfo();
    await fetchHomeRequest();
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  useEffect(() => {
    fetchAllRequests();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!homeRequest) {
        setLoading(true);
        fetchHomeRequest();
        setLoading(false);
      }
    }, [homeRequest])
  );

  useFocusEffect(
    useCallback(() => {
      if (!userInfo) {
        setLoading(true);
        fetchUserInfo();
        setLoading(false);
      }
    }, [userInfo])
  );

  const onRefresh = async () => {
    setLoading(true);

    await fetchUserInfo();
    await fetchHomeRequest();

    setLoading(false);
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      unsubscribe = await listenToNotifications(setNotifications as any);
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe(); // Clean up listener on unmount
    };
  }, []);

  if (fakeLoading || loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView className="w-full h-full mt-5 px-4">
        <View className="flex flex-row justify-between items-center pr-6 bg-[#DBE2EF] rounded-full mb-5">
          <View className="flex flex-row items-center">
            {userInfo && (userInfo.user || userInfo).avatarUrl ? (
              <Image
                source={{
                  uri: `${
                    (userInfo.user || userInfo).avatarUrl
                  }&timestamp=${new Date().getTime()}`,
                }}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <FontAwesome name="user-circle" size={64} color="black" />
            )}

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-xl font-bold ml-5 w-[70%]"
            >
              {(userInfo && (userInfo.user || userInfo).fullName) || "User"}
            </Text>
          </View>
          <View>
            <Notificaton />
          </View>
        </View>
        <Text className="text-center font-bold text-xl my-1">
          Yêu Cầu Sửa Chữa Gần Đây
        </Text>
        <RenderRequestItem
          requests={homeRequest}
          refreshing={loading}
          onRefresh={onRefresh}
          size="big"
        />
      </SafeAreaView>
    </>
  );
};

export default Home;
