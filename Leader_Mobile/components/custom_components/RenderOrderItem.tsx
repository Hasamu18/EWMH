import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { ShippingOrder } from "@/model/order";
import { useGlobalState } from "@/context/GlobalProvider";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { formatDate, getOrderStatusDetails } from "@/utils/utils";
import StatusTag from "./StatusTag";
import { router } from "expo-router";
import EmptyState from "./EmptyState";

interface RenderOrderItemProps {
  orders: ShippingOrder[];
  refreshing: boolean;
  onRefresh: () => void;
}

const RenderOrderItem = ({
  orders,
  onRefresh,
  refreshing,
}: RenderOrderItemProps) => {
  const { loading } = useGlobalState();

  const renderItem = ({ item }: { item: ShippingOrder }) => {
    // Safely access the nested properties using optional chaining
    const shipping = item?.item?.shipping;
    const customerInfo = item?.getCusInfo;

    // If the shipping or customer info is missing, return an empty view or error message
    if (!shipping || !customerInfo) {
      return (
        <View className="flex-row items-center rounded-lg border border-black mb-4 overflow-hidden bg-[#4072AF]">
          <Text className="text-center text-lg text-gray-500">Invalid order data</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => router.push(`/orderDetail/${shipping.shippingId}`)}
        className="flex-row items-center rounded-lg border border-black mb-4 overflow-hidden bg-[#4072AF]"
      >
        <View className="h-full w-[15%] rounded-l-lg flex-row items-center">
          <Image
            source={{
              uri: `${customerInfo.avatarUrl}&timestamp=${new Date().getTime()}`,
            }}
            className="w-[75px] h-[75px] rounded-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 p-4 bg-white">
          <View className="flex-row justify-evenly items-center mb-3">
            <Text className="text-2xl font-bold mb-1 w-[50%]">
              {customerInfo.fullName}
            </Text>
            <Text
              className="text-sm mb-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {shipping.shippingId}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="w-[50%]">
              <Text className="text-base mb-3">
                <FontAwesome name="phone" size={20} color="black" /> {customerInfo.phoneNumber}
              </Text>
              <Text className="text-base mb-3">
                <Entypo name="home" size={24} color="black" /> {shipping.address}
              </Text>
              <Text className="text-base mb-1">
                <Entypo name="calendar" size={20} color="black" />{" "}
                {formatDate(shipping.shipmentDate)}
              </Text>
            </View>
            <StatusTag status={getOrderStatusDetails(shipping.status)} size="big" />
          </View>
          <View className="mt-2">
            <Text className="text-lg font-bold">Ghi chú:</Text>
            <Text className="text-base text-black">
              {shipping.customerNote || "Không có ghi chú"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item?.item?.shipping?.shippingId?.toString() || ""}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
      <EmptyState
        title="Không có đơn hàng"
        subtitle="Không tìm đơn hàng chờ nào"
      />
      }
    />
  );
};

export default RenderOrderItem;
