import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useGlobalState } from "@/context/GlobalProvider";
import { useNotification } from "@/hooks/useNotification";
import { NotificationItem } from "@/model/notification";
import EmptyState from "@/components/custom_components/EmptyState";
import { formatDate } from "@/utils/utils";
import { useOrder } from "@/hooks/useOrder";

const NotificationList = () => {
  const navigation = useNavigation();
  const { loading, setLoading } = useGlobalState();
  const { fetchNotifications, markAllAsRead, notificationList } = useNotification();
  const { handleGetOrder} =
  useOrder();

  useEffect(() => {
    // Set the header options for the screen
    navigation.setOptions({
      headerTitle: "Danh sách thông báo",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
    });

    // Fetch the notifications on mount
  }, [navigation]);

  const loadNotifications = async () => {
    setLoading(true);
    await fetchNotifications();
    await handleGetOrder(1,0)
    setLoading(false);
  };

  const loadOrder = async () => {
    await handleGetOrder(1,0)
  };

  useEffect(() => {
    fetchNotifications();
    console.log("Notification List:",notificationList)
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!notificationList) {
        loadNotifications();
      }
      loadOrder()
      return async () => {
        // Mark all notifications as read when the user exits the screen
        if (notificationList?.length > 0) {
          await markAllAsRead(); // Wait for marking as read
        }
      };
    }, [notificationList])
  );
  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      className="rounded-lg border border-black mb-5 mx-3 overflow-hidden"
      onPress={() => {
        if (item.data?.requestId) {
          router.push(`/requestDetail/${item.data.requestId}`);
        } else if (item.data?.contractId) {
          router.push(`/contractDetail/${item.data.contractId}`);
        } else if (item.data?.orderId) {
          router.push(`/orderDetail/${item.data.orderId}`);
        }
      }}
    >
      <View>
        <View className={`flex-row justify-between items-center mb-2 px-3 pt-3 pb-2 ${!item?.read ? `bg-[#4072AF]` : `bg-[#b7d8ff]`}`}>
          <Text className={`font-bold text-base ${!item?.read && `text-white`}`}>
            {item?.title || "Không có tiêu đề"}
          </Text>
          <Text className={`text-sm font-bold ${!item?.read && `text-white`}`}>
            {item?.timestamp ? formatDate(item.timestamp) : "Không có thời gian"}
          </Text>
        </View>
        <View className="p-3">
          <Text className="text-sm">
            {item?.body || "Không có nội dung"}
          </Text>
          {item?.data && (
            <View className="mt-3">
              {Object.entries(item.data).map(([key, value]) => {
                let label = "Không xác định";
                if (key === "contractId") label = "Mã hợp đồng";
                if (key === "requestId") label = "Mã yêu cầu";
                if (key === "orderId") label = "Mã đơn hàng";
                return (
                  <Text key={key} className="text-sm">
                    {label}: {value || "Không có dữ liệu"}
                  </Text>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  if (!notificationList || notificationList.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
              <EmptyState
                title="Không có thông báo"
                subtitle="Hiện tại bạn không có thông báo"
              />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 py-3">
      <FlatList
        data={notificationList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        // ListHeaderComponent={() => (
        //   <TouchableOpacity
        //     onPress={clearNotifications}
        //     style={{
        //       padding: 10,
        //       margin: 10,
        //       backgroundColor: "#e63946",
        //       borderRadius: 8,
        //     }}
        //   >
        //     <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>
        //       Xóa tất cả thông báo
        //     </Text>
        //   </TouchableOpacity>
        // )}
      />
    </SafeAreaView>
  );
};

export default NotificationList;
