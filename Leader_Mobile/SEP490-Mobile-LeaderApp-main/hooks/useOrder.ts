import { useGlobalState } from "@/context/GlobalProvider";
import useAxios from "@/utils/useSaleAxios";
import * as SecureStore from "expo-secure-store";
import { useNotification } from "./useNotification";
import { Message } from "@/model/notification";


export function useOrder() {
  const { fetchData, error } = useAxios();
  const {
    orders,
    setOrders,
    searchOrderQuery,
    setSearchOrderQuery,
  } = useGlobalState();
  const { sendPushNotification, GetLatestPushNotificationRecordByWorkerId } =
  useNotification();

  const ITEMS_PER_PAGE = 8; 

  const handleGetOrder = async (PageIndex = 1, status?: number) => {
    const accountId = await SecureStore.getItemAsync('accountId');
  
    try {
      const response = await fetchData({
        url: "/shipping/1",
        method: "GET",
        params: {
          Pagesize: ITEMS_PER_PAGE,
          PageIndex,
          SearchByPhone: searchOrderQuery,
          LeaderId: accountId,
          Status: status
        },
      });  
      if (response && response.result) {
        setOrders(response.result); 
        const totalPages = Math.ceil(response.count / ITEMS_PER_PAGE);
        return { orders: response.result, totalPages };  
      } else {
        setOrders([]);
        console.error("No order found or failed response:", response || error);
        return { orders: [], totalPages: 0 };
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      return { orders: [], totalPages: 0 };
    }
  };

  const handleGetOrderDetail = async (OrderId : string | string[]) => {
    try {
      const response = await fetchData({
        url: "/order/8",
        method: "GET",
        params: {
          OrderId
        },
      });  
      if (response) { 
        return response;  
      } else {
        console.error("No orders found or failed response:", response || error);
        return;
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      return { orders: [], totalPages: 0 };
    }
  };

  const handleGetOrderDetailStatusWorker = async (ShippingId  : string | string[]) => {
    try {
      const response = await fetchData({
        url: "/shipping/3",
        method: "GET",
        params: {
          ShippingId
        },
      });  
      if (response) { 
        return response;  
      } else {
        console.error("No orders found or failed response:", response || error);
        return;
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      return { orders: [], totalPages: 0 };
    }
  };

  const handleAddWorkerToOrder = async (data: any) => {
    try {
      const response = await fetchData({
        url: "/shipping/2",
        method: "POST",
        data: data,
      });
  
      if (response) {
        console.log("Workers successfully added:", response);
        await SecureStore.deleteItemAsync("orders");
        // Iterate over the workerList to send notifications
          const latestRecord = await GetLatestPushNotificationRecordByWorkerId(data.workerId);
  
          if (latestRecord) {
            // Create the notification payload
            const notification = {
              to: latestRecord.exponentPushToken, // Replace with actual field from latestRecord
              title: "Bạn có đơn hàng mới",
              body: `Bạn vừa được giao cho vận đơn mới`,
              data: { requestId: data.requestId },
            } as Message;
  
            // Send the notification
            await sendPushNotification(notification);
          } else {
            console.log(`No push notification record found for workerId: ${data.workerId}`);
          }
  
        return response;
      } else {
        console.log("Failed to add workers to request");
        return null;
      }
    } catch (error) {
      console.error("Error in handleAddWorkerToRequest:", error);
      throw error;
    }
  };

  return {
    orders,
    searchOrderQuery,
    handleGetOrder,
    setSearchOrderQuery,
    handleGetOrderDetail,
    handleAddWorkerToOrder,
    handleGetOrderDetailStatusWorker
  };
}
