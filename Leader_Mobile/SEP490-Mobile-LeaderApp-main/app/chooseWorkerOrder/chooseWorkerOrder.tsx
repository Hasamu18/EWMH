import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import RenderOrderItem from "@/components/custom_components/RenderOrderItem"; // Adjust path as needed
import { ShippingOrder } from "@/model/order";
import { useFocusEffect } from "@react-navigation/native";
import ChooseWorkerModal from "@/components/custom_components/ChooseWorkerModal";
import { useWorker } from "@/hooks/useWorker";
import CustomButton from "@/components/custom_components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalState } from "@/context/GlobalProvider";
import { useFakeLoading } from "@/utils/utils";
import { useNavigation } from "expo-router";
import IconButton from "@/components/custom_components/IconButton";

const ChooseWorkerOrder = () => {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const { setLoading, loading } = useGlobalState();
  const [fakeLoading, setFakeLoading] = useState(true);
  const [isWorkerModalVisible, setWorkerModalVisible] = useState(false);
  const [orderIds, setOrderIds] = useState<string[]>([]); 
  const { freeWorker } = useWorker();
  const navigation = useNavigation();


  useFakeLoading(setFakeLoading);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đơn hàng chờ",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
      headerRight: () => (
        <IconButton
          icon={<Ionicons name="trash-bin" size={24} color="white" />}
          handlePress={() => handleDeleteOrders()}
        />
      ),
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchOrders = async () => {
        try {
          const storedOrders = await SecureStore.getItemAsync("orders");
          if (storedOrders) {
            const parsedOrders = JSON.parse(storedOrders); // Parse stored orders from SecureStore
            setOrders(parsedOrders); // Update the state with the stored orders
            console.log("orders:", parsedOrders);

            // Extract orderId from each order and store them in the orderIds state
            const ids = parsedOrders.map(
              (order: ShippingOrder) => order.item.order.orderId
            );
            setOrderIds(ids);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, []) // Empty dependency array ensures this runs once when the screen is focused
  );

  const handleDeleteOrders = () => {
    // Show confirmation alert before deleting orders
    Alert.alert(
      "Xóa đơn hàng chờ",
      "Bạn có muốn xóa hết đơn hàng chờ?",
      [
        {
          text: "Hủy",
          style: "cancel", // If the user cancels, do nothing
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync("orders"); // Delete orders from SecureStore
              setOrders([]); // Clear the orders state
              setOrderIds([]); // Clear the orderIds state
              console.log("Orders deleted successfully");
            } catch (error) {
              console.error("Error deleting orders:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleOpenWorkerModal = () => {
    setWorkerModalVisible(true);
  };

  const handleCloseWorkerModal = () => {
    setWorkerModalVisible(false);
  };

  if (fakeLoading || loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className="flex-1 p-4">
      <RenderOrderItem
        orders={orders}
        refreshing={false}
        onRefresh={() => {}}
      />
      <CustomButton
        title="Cho Nhân Viên Đảm Nhận"
        icon={<Ionicons name="add-circle-outline" size={24} color="white" />}
        containerStyles="my-5"
        handlePress={handleOpenWorkerModal}
        isLoading={orders.length === 0}
      />
      <ChooseWorkerModal
        workers={freeWorker}
        visible={isWorkerModalVisible}
        onClose={handleCloseWorkerModal}
        orderId={orderIds}
      />
    </SafeAreaView>
  );
};

export default ChooseWorkerOrder;
