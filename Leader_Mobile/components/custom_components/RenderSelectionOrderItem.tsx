import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { ShippingOrder } from "@/model/order";
import { useGlobalState } from "@/context/GlobalProvider";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { formatDate, getOrderStatusDetails } from "@/utils/utils";
import StatusTag from "./StatusTag";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import CustomButton from "./CustomButton";

interface RenderOrderItemProps {
  orders: ShippingOrder[];
  refreshing: boolean;
  onRefresh: () => void;
  selectedOrders: string[]; // Add selectedOrders as a prop.
  toggleSelection: (shippingId: string) => void; // Add toggleSelection as a prop.
}

const RenderSelectionOrderItem = ({
  orders,
  onRefresh,
  refreshing,
  selectedOrders,
  toggleSelection,
}: RenderOrderItemProps) => {
  const { loading } = useGlobalState();

  const renderItem = ({ item }: { item: ShippingOrder }) => {
    const isSelected = selectedOrders.includes(item.item.shipping.shippingId);

    return (
      <View className="flex-row items-center rounded-lg border border-black mb-4 overflow-hidden bg-[#4072AF]">
        {/* Checkbox */}
        <TouchableOpacity
          className="flex-row items-center rounded-lg flex-1"
          // onPress={() => router.push(`/orderDetail/${item.item.shipping.shippingId}`)}
        >
          {/* Avatar */}
          <View className="h-full w-[15%] rounded-l-lg flex-row items-center">
            <Image
              source={{
                uri: `${
                  item.getCusInfo.avatarUrl
                }&timestamp=${new Date().getTime()}`,
              }}
              className="w-[75px] h-[75px] rounded-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-1 p-4 bg-white">
            <View className="flex-row justify-end">
              <Checkbox
                value={isSelected}
                onValueChange={() =>
                  toggleSelection(item.item.shipping.shippingId)
                }
                className=""
                color={isSelected ? "#4072AF" : undefined}
              />
            </View>
            <View className="flex-row justify-evenly items-center mb-3">
              <Text className="text-2xl font-bold mb-1 w-[50%]">
                {item.getCusInfo.fullName}
              </Text>
              <Text
                className="text-sm mb-1"
                numberOfLines={1} // Ensures the orderId stays on a single line if needed
                ellipsizeMode="tail" // Adds ellipsis if the text overflows
              >
                {item.item.order.orderId}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="w-[50%]">
                <Text className="text-base mb-3">
                  <FontAwesome name="phone" size={20} color="black" />{" "}
                  {item.getCusInfo.phoneNumber}
                </Text>
                <Text className="text-base mb-1">
                  <Entypo name="calendar" size={20} color="black" />{" "}
                  {formatDate(item.item.shipping.shipmentDate)}
                </Text>
              </View>
              <StatusTag
                status={getOrderStatusDetails(item.item.shipping.status)}
                size="big"
              />
            </View>
            <View className="mt-2">
              <Text className="text-lg font-bold">Ghi chú:</Text>
              <Text className="text-base text-black">
                {item.item.shipping.customerNote || "Không có ghi chú"}
              </Text>
            </View>
            <CustomButton
              title="Xem chi tiết"
              icon={<AntDesign name="addfolder" size={24} color="white" />}
              containerStyles="mx-1"
              handlePress={() =>
                router.push(`/orderDetail/${item.item.shipping.shippingId}`)
              }
              isLoading={selectedOrders.length === 0}
            />
          </View>
        </TouchableOpacity>
      </View>
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
      keyExtractor={(item) => item.item.shipping.shippingId}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <Text className="text-center text-lg text-gray-500">
          No orders found
        </Text>
      }
    />
  );
};

export default RenderSelectionOrderItem;
