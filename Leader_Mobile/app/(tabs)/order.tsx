import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { useGlobalState } from "@/context/GlobalProvider";
import EmptyState from "@/components/custom_components/EmptyState";
import RenderOrderItem from "@/components/custom_components/RenderOrderItem";
import SearchInput from "@/components/custom_components/SearchInput";
import { useFakeLoading } from "@/utils/utils";
import IconButton from "@/components/custom_components/IconButton";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/custom_components/CustomButton";
import { router } from "expo-router";

const STATUS_OPTIONS = [
  { label: "Đơn hàng mới", value: 0 },
  { label: "Đã tiếp nhận", value: 1 },
  { label: "Đang giao", value: 2 },
  { label: "Đã hoàn thành", value: 3 },
  { label: "Đang trì hoãn", value: 4 },
];

const Order = () => {
  const { orders, handleGetOrder, searchOrderQuery, setSearchOrderQuery } =
    useOrder();
  const { loading, setLoading, selectedStatus, setSelectedStatus } =
    useGlobalState();
  const timeoutRef = useRef<number | null>(null);
  const [fakeLoading, setFakeLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useFakeLoading(setFakeLoading);

  const fetchOrder = useCallback(
    async (page = 1, status = selectedStatus) => {
      const { orders: newOrders, totalPages: fetchedTotalPages } =
        await handleGetOrder(page, status);
      setTotalPages(fetchedTotalPages);
      setLoading(false);
      return newOrders.length > 0;
    },
    [handleGetOrder, selectedStatus, setLoading]
  );

  useEffect(() => {
    setLoading(true);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchOrder(pageIndex, selectedStatus);
    }, 500) as unknown as number;

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pageIndex, searchOrderQuery, selectedStatus]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPageIndex(1);
    await fetchOrder(1, selectedStatus);
    setRefreshing(false);
  };

  const handleNextPage = async () => {
    if (pageIndex < totalPages) {
      const hasMore = await fetchOrder(pageIndex + 1, selectedStatus);
      if (hasMore) setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = async () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleSubmitSearch = async () => {
    setPageIndex(1);
    await fetchOrder(1, selectedStatus);
  };

  const handleStatusChange = async (status: number) => {
    setSelectedStatus(status);
    setPageIndex(1);
    setLoading(true);
    await fetchOrder(1, status);
  };

  if (fakeLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  const allOrdersEmpty = !orders.length;

  return (
    <SafeAreaView className="w-full h-full mt-5 px-4">
      <View className="flex flex-row w-full justify-center mb-5">
        <SearchInput
          placeholder="Tìm kiếm bằng SĐT"
          searchQuery={searchOrderQuery}
          setSearchQuery={setSearchOrderQuery}
          handleSubmitSearch={handleSubmitSearch}
        />
      </View>

      <View className="flex flex-row justify-between mb-3">
        {STATUS_OPTIONS.map((status) => (
          <TouchableOpacity
            key={status.value}
            onPress={() => handleStatusChange(status.value)}
            className={`p-3 rounded ${
              selectedStatus === status.value ? "bg-[#4072AF]" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-sm ${
                selectedStatus === status.value ? "text-white" : "text-black"
              }`}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
        <CustomButton
          title="Xem danh sách đơn hàng chờ"
          icon={<Ionicons name="add-circle-outline" size={24} color="white" />}
          containerStyles="mx-1 my-5"
          handlePress={() =>
            router.push("/chooseWorkerOrder/chooseWorkerOrder")
          }
        />

      {allOrdersEmpty ? (
        <View className="flex-1 justify-center items-center">
          <EmptyState
            title="Không có đơn hàng nào"
            subtitle="Xin hãy thử lại sau"
            onRefresh={onRefresh}
          />
        </View>
      ) : !loading ? (
        <>
          <View className="flex flex-row items-center justify-center my-3">
            <IconButton
              handlePress={handlePreviousPage}
              disabled={pageIndex === 1}
              icon={
                <AntDesign
                  name="caretleft"
                  size={24}
                  color={pageIndex === 1 ? "black" : "white"}
                />
              }
              containerStyles="p-2"
            />
            <Text className="mx-3">
              Trang {pageIndex}/{totalPages}
            </Text>

            <IconButton
              handlePress={handleNextPage}
              disabled={pageIndex >= totalPages}
              icon={
                <AntDesign
                  name="caretright"
                  size={24}
                  color={pageIndex >= totalPages ? "black" : "white"}
                />
              }
              containerStyles="p-2"
            />
          </View>
          <RenderOrderItem
            orders={orders}
            refreshing={loading || refreshing}
            onRefresh={onRefresh}
          />
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#5F60B9" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Order;
