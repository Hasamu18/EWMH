import { TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNotification } from "@/hooks/useNotification";

const Notification = () => {
  const { notificationList } = useNotification();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Update the unread notification state whenever the list changes
  useEffect(() => {
    const unread = notificationList.some((notification) => !notification.read);
    setHasUnreadNotifications(unread);
  }, [notificationList]);

  return (
    <TouchableOpacity
      className="flex flex-row"
      onPress={() => router.push("/notificationList/notificationList")}
    >
      <FontAwesome name="bell" size={24} color="#4072AF" />
      {hasUnreadNotifications && (
        <View className="bg-red-600 rounded-full w-3 h-3 -ml-3 border-white border-2" />
      )}
    </TouchableOpacity>
  );
};

export default Notification;
