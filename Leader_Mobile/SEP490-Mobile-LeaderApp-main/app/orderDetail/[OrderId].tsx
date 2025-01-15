import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useOrder } from "@/hooks/useOrder";
import { OrderDetails } from "@/model/order";
import {
  formatCurrency,
  formatDate,
  getOrderStatusDetails,
  handlePhonePress,
  useFakeLoading,
} from "@/utils/utils";
import StatusTag from "@/components/custom_components/StatusTag";
import RenderOrderProductItem from "@/components/custom_components/RenderOrderProductItem";
import { useWorker } from "@/hooks/useWorker";
import CustomButton from "@/components/custom_components/CustomButton";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useGlobalState } from "@/context/GlobalProvider";
import ChooseWorkerModal from "@/components/custom_components/ChooseWorkerModal";
import EmptyState from "@/components/custom_components/EmptyState";
import * as SecureStore from "expo-secure-store";

const OrderDetail = () => {
  const params = useLocalSearchParams();
  const { OrderId } = params;
  const { handleGetOrderDetail, handleGetOrderDetailStatusWorker, orders } =
    useOrder();
  const [orderDetail, setOrderDetail] = useState<OrderDetails>();
  const [workerInfo, setWorkerInfo] = useState<any>(); // Worker info state
  const [orderStatus, setOrderStatus] = useState<number>(); // Order status state
  const navigation = useNavigation();
  const { setLoading, loading } = useGlobalState();
  const [fakeLoading, setFakeLoading] = useState(true);
  const [isOrderInStore, setIsOrderInStore] = useState(false);

  useFakeLoading(setFakeLoading);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Chi tiết đơn hàng",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
    });

    if (OrderId) {
      setLoading(true);
      fetchOrderDetail(OrderId);
      setLoading(false);
    }
  }, [OrderId, navigation]);

  useEffect(() => {
    checkOrderInStore();
  }, [orderDetail]);

  const checkOrderInStore = async () => {
    const result = await isOrderInSecureStore();
    setIsOrderInStore(result);
  };

  const fetchOrderDetail = async (id: string | string[]) => {
    try {
      const detail = await handleGetOrderDetail(id);
      if (detail) {
        setOrderDetail(detail);
      } else {
        console.error("No details found for the given OrderId.");
      }

      // Fetch the order status and worker info
      const statusWorkerData = await handleGetOrderDetailStatusWorker(id);
      if (statusWorkerData) {
        setOrderStatus(statusWorkerData.shippingOrder.status);
        setWorkerInfo(statusWorkerData.workerInfo);
      } else {
        console.error("No order status or worker info found.");
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
    }
  };

  const isOrderInSecureStore = async () => {
    try {
      const storedOrders = await SecureStore.getItemAsync("orders");
      let ordersArray = storedOrders ? JSON.parse(storedOrders) : [];

      // Check if the current orderDetail exists in the stored orders
      return ordersArray.some(
        (order: any) =>
          order.item.order.orderId ===
          orderDetail?.order.result[0]?.orderDetail.orderId
      );
    } catch (error) {
      console.error("Error checking if order is in secure store:", error);
      return false;
    }
  };

  const handleAddOrDeleteOrder = async () => {
    try {
      setLoading(true);
      if (orderDetail) {
        // Compare orderId with orders state from useOrder
        const matchedOrder = orders.find(
          (order: any) =>
            order.item.order.orderId ===
            orderDetail.order.result[0]?.orderDetail.orderId
        );

        if (matchedOrder) {
          // If the order is found, check the secure store
          const storedOrders = await SecureStore.getItemAsync("orders");
          let ordersArray = storedOrders ? JSON.parse(storedOrders) : [];

          // Check if the order already exists in the secure store
          const isOrderExists = ordersArray.some(
            (order: any) =>
              order.item.order.orderId === matchedOrder.item.order.orderId
          );

          if (isOrderExists) {
            // If the order exists, remove it
            ordersArray = ordersArray.filter(
              (order: any) =>
                order.item.order.orderId !== matchedOrder.item.order.orderId
            );
            await SecureStore.setItemAsync(
              "orders",
              JSON.stringify(ordersArray)
            );
            console.log("Order removed from secure store:", matchedOrder);
            fetchOrderDetail(OrderId);
            setLoading(false);
          } else {
            // If the order doesn't exist, add it
            ordersArray.push(matchedOrder);
            await SecureStore.setItemAsync(
              "orders",
              JSON.stringify(ordersArray)
            );
            console.log("Matched order added to secure store:", matchedOrder);
            fetchOrderDetail(OrderId);
            setLoading(false);
          }
        } else {
          console.log("No matching order found in the orders state");
          setLoading(false);
        }
      } else {
        console.log("Order details are not available");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error handling order:", error);
      setLoading(false);
    }
  };

  if (fakeLoading || loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="p-4 flex-1">
      <ScrollView>
        {orderDetail ? (
          <>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-base text-gray-500 mb-10">
                  Mã đơn hàng:
                </Text>
                <Text className="text-base text-gray-500 mb-10">
                  Trạng thái:
                </Text>
                <Text className="text-base text-gray-500 mb-10">
                  Ngày đặt đơn:
                </Text>
                {orderStatus === 3 && (
                  <Text className="text-base text-gray-500">
                    Ngày nhận hàng:
                  </Text>
                )}
              </View>
              <View className="flex items-end">
                <Text className="text-base text-right mb-10 mr-3">
                  {orderDetail.order.result[0]?.orderDetail.orderId}
                </Text>
                <View className="mb-10">
                  <StatusTag
                    status={getOrderStatusDetails(orderStatus)}
                    size="big"
                  />
                </View>
                <Text className="text-base text-right mb-10 mr-3">
                  {formatDate(orderDetail.order.purchaseTime)}
                </Text>
                {orderDetail.customer.shipping.deliveriedDate && (
                  <Text className="text-base text-right mb-10 mr-3">
                    {formatDate(orderDetail.customer.shipping.deliveriedDate)}
                  </Text>
                )}
              </View>
            </View>
            <Text className="text-2xl text-center my-4 font-bold">
              Khách hàng
            </Text>
            <View className="bg-[#DBE2EF] rounded-xl py-4">
              <View className="flex-row justify-center items-center">
                <Image
                  source={{
                    uri: `${
                      orderDetail.customer.avatarUrl
                    }&timestamp=${new Date().getTime()}`,
                  }}
                  className="w-12 h-12 rounded-full mr-5"
                />
                <Text className="text-lg">{orderDetail.customer.fullName}</Text>
              </View>
              <View className="pl-4">
                <View className="flex-col my-3">
                  <View className="flex-row items-center my-1">
                    <AntDesign name="mail" size={15} color="black" />
                    <Text className="text-base ml-2">
                      {orderDetail.customer.email}
                    </Text>
                  </View>
                  <View className="flex-row items-center my-1">
                    <Entypo name="location-pin" size={15} color="black" />
                    <Text className="text-base ml-2">
                      {orderDetail.customer.shipping?.address}
                    </Text>
                  </View>
                  <View className="flex-row items-center my-1">
                    <Entypo name="home" size={24} color="black" />
                    <Text className="text-base ml-2">
                      {orderDetail.apartment.address}
                    </Text>
                  </View>
                  <View className="flex-row items-center my-1">
                    <FontAwesome name="phone" size={15} color="black" />
                    <Text className="text-base ml-2">
                      {orderDetail.customer.phoneNumber}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Text className="text-2xl text-center my-4 font-bold">
              Nhân viên đảm nhận
            </Text>
            {workerInfo ? (
              <View className="w-full flex-row justify-center">
                <View
                  style={{ width: "47.7%", marginBottom: 16 }}
                  className="bg-[#DBE2EF] mx-1 rounded-lg shadow-lg"
                >
                  <Image
                    source={{
                      uri: `${
                        workerInfo?.avatarUrl
                      }&timestamp=${new Date().getTime()}`,
                    }}
                    className="w-full h-32 rounded-md mb-2"
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <Text
                      className="text-lg text-center font-bold mb-1"
                      numberOfLines={1}
                    >
                      {workerInfo?.fullName}
                    </Text>
                    <View className="flex-row justify-evenly items-center">
                      <Text className="text-gray-500">
                        {workerInfo?.phoneNumber}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          handlePhonePress(workerInfo?.phoneNumber)
                        }
                        className="bg-blue-500 rounded-md p-2 flex-row justify-center items-center"
                      >
                        <FontAwesome name="phone" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <>
                <EmptyState
                  title="Chưa có nhân viên"
                  subtitle="Đơn hàng chưa được gán nhân viên"
                />
                <CustomButton
                  title={
                    isOrderInStore
                      ? "Xóa khỏi đơn hàng chờ"
                      : "Thêm vào đơn hàng chờ"
                  }
                  icon={
                    <Ionicons
                      name={
                        isOrderInStore ? "trash-outline" : "add-circle-outline"
                      }
                      size={24}
                      color="white"
                    />
                  }
                  containerStyles="my-5"
                  handlePress={handleAddOrDeleteOrder}
                  isLoading={loading}
                />
              </>
            )}

            <Text className="text-2xl text-center my-4 font-bold">
              Sản phẩm của đơn hàng
            </Text>
            <View className="flex-col">
              <Text className="text-base">
                Ngày mua:{" "}
                {orderDetail.order.purchaseTime
                  ? formatDate(orderDetail.order.purchaseTime)
                  : "Không có dữ liệu"}
              </Text>
              <View className="flex-row justify-between items-center px-2 my-5">
                <Text className="p-2 border border-black rounded">
                  {orderDetail.order.result.length} sản phẩm
                </Text>
                <Text className="text-[#3F72AF] text-base">
                  {formatCurrency(orderDetail?.order.sum)}
                </Text>
              </View>
            </View>
            <RenderOrderProductItem details={orderDetail?.order.result} />
          </>
        ) : (
          <EmptyState
            title="Không có đơn hàng"
            subtitle="Không tìm đơn hàng mà bạn cần"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetail;
