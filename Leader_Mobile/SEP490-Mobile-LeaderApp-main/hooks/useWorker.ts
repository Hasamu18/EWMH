import { useGlobalState } from "@/context/GlobalProvider";
import useAxios from "@/utils/useRequestAxios";
import { useNotification } from "./useNotification";
import { Message } from "@/model/notification";

export function useWorker() {
  const { fetchData, error } = useAxios();
  const { busyWorker, setBusyWorker, freeWorker, setFreeWorker, worker, setWorker} =
    useGlobalState();
      const {  sendPushNotification,
        GetLatestPushNotificationRecordByWorkerId
  } = useNotification();

  const handleGetAllWorker = async () => {
    const response = await fetchData({
      url: "/account/17",
      method: "GET",
    });

    if (response) {
      setWorker(response);
    } else {
      console.log("Failed to fetch worker list");
      console.log("Worker Error:", error);
    }
  };

  const handleGetWorker = async (isFree: boolean) => {
    const response = await fetchData({
      url: "/request/17",
      method: "GET",
      params: {
        isFree: isFree,
      },
    });

    if (response) {
      switch (isFree) {
        case false:
          setBusyWorker(response);
          break;
        case true:
          setFreeWorker(response);
          break;
        default:
          console.log("Unknown status");
          console.log("Request Error", error);
          break;
      }
    } else {
      console.log("Failed to fetch worker list");
      console.log("Worker Error:", error);
    }
  };

  const handleAddWorkerToRequest = async (data: any) => {
    try {
      const response = await fetchData({
        url: "/request/5",
        method: "POST",
        data: data,
      });
  
      if (response) {
        console.log("Workers successfully added:", response);
  
        // Iterate over the workerList to send notifications
        for (const worker of data.workerList) {
          const latestRecord = await GetLatestPushNotificationRecordByWorkerId(worker.workerId);
  
          if (latestRecord) {
            // Create the notification payload
            const notification = {
              to: latestRecord.exponentPushToken, // Replace with actual field from latestRecord
              title: "Bạn có yêu cầu mới",
              body: worker.isLead
                ? "Bạn là trưởng nhóm của yêu cầu"
                : "Bạn vửa được giao yêu cầu mới",
              data: { requestId: data.requestId },
            } as Message;
  
            // Send the notification
            await sendPushNotification(notification);
          } else {
            console.log(`No push notification record found for workerId: ${worker.workerId}`);
          }
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
    busyWorker,
    freeWorker,
    worker,
    handleGetWorker,
    handleAddWorkerToRequest,
    handleGetAllWorker,
  };
}
