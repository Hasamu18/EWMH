import Constants from "expo-constants";
import {
  collection,
  getFirestore,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  where,
  limit,
  addDoc,
  getDoc,
  setDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useGlobalState } from "@/context/GlobalProvider";
import { Message, NotificationItem } from "@/model/notification";
import {
  CUSTOMER_TO_LEADER_COLLECTION,
  firebaseApp,
  LEADER_TO_WORKER_COLLECTION,
} from "../utils/firebaseConfig";
import { PushNotificationRecord } from "@/model/notification";
import * as SecureStore from "expo-secure-store";


export const useNotification = () => {
  const db = getFirestore(firebaseApp);
  const {
    notification,
    setNotification,
    setNotificationList,
    notificationList,
    expoPushToken,
    setExpoPushToken,
  } = useGlobalState();

  // Configure notifications
  const configureNotifications = async () => {

    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
        });
        console.log("Notification channel created successfully!");
      } catch (error) {
        console.error("Failed to create notification channel:", error);
      }
    }

    console.log("Notification handler configured successfully!");
  };

  // Get Expo push token
  const getExpoPushTokenAsync = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Thông báo bị từ chối", "Vui lòng bật thông báo trong cài đặt.");
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error("Project ID not found");
      }
      console.log("Project Id:", projectId);

      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log("Token Response:", tokenResponse);
      setExpoPushToken(tokenResponse.data);
      return tokenResponse.data;
    } catch (error) {
      console.error(
        "Error requesting permissions or getting push token:",
        error
      );
    }
  };

  // Send push notification using Expo push notification API
  const sendPushNotification = async (notification: Message) => {
    console.log("Notification payload:", notification);

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      const data = await response.json();
      console.log("Push notification response:", data); // Log response from Expo API

      if (!response.ok) {
        throw new Error("Failed to send push notification");
      }
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };

  const AddPushNotificationRecord = async (
    pnRecord: PushNotificationRecord
  ) => {
    try {
      // const docRefWorker = await addDoc(
      //   collection(db, LEADER_TO_WORKER_COLLECTION),
      //   pnRecord
      // );
      const docRefCustomer = await addDoc(
        collection(db, CUSTOMER_TO_LEADER_COLLECTION),
        pnRecord
      );
      // console.log("docRefWorker:", docRefWorker);
      console.log("docRefCustomer:", docRefCustomer);

      // console.log("Worker document written with ID: ", docRefWorker.id);
      console.log("Customer document written with ID: ", docRefCustomer.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const GetLatestPushNotificationRecordByWorkerId = async (
    workerId: string
  ): Promise<PushNotificationRecord | null> => {
    try {
      const pnQuery = query(
        collection(db, LEADER_TO_WORKER_COLLECTION), // Replace with your Firestore collection name
        where("workerId", "==", workerId),
        orderBy("date", "desc"), // Order by date in descending order
        limit(1) // Limit to the most recent record
      );
      const querySnapshot = await getDocs(pnQuery);

      if (!querySnapshot.empty) {
        const latestRecord = querySnapshot.docs[0].data();
        console.log("Latest Record:", latestRecord);
        return latestRecord as PushNotificationRecord;
      } else {
        console.log("No records found for workerId:", workerId);
        return null;
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };



  const listenToNotifications = async (updateNotifications: (data: NotificationItem[]) => void) => {
    const leaderId = await SecureStore.getItemAsync("accountId"); // Retrieve the leaderId from SecureStore
    if (!leaderId) {
      console.error("Leader ID is missing. Cannot listen to notifications.");
      return;
    }
  
    let lastTimestamp: string | null = null; // Track the latest notification timestamp
  
    try {
      // Access the document for the leader in the UserNotificationCollection
      const docRef = doc(db, "UserNotificationCollection", leaderId);
  
      // Set up a real-time listener
      const unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
        if (!docSnapshot.exists()) {
          console.log("No notifications found for this leader.");
          updateNotifications([]); // Clear notifications if the document doesn't exist
          return;
        }
  
        // Retrieve the notifications array from the document
        const notifications = docSnapshot.data()?.notifications || [];
  
        // Sort notifications by timestamp in descending order
        const sortedNotifications = notifications.sort((a: any, b: any) => {
          const timestampA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const timestampB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return timestampB - timestampA; // Descending order
        });
  
        // Check for new notifications
        const newNotifications = sortedNotifications.filter((notification: any) => {
          const timestamp = notification.timestamp || "";
          const read = notification.read || false;
          return timestamp > (lastTimestamp || "") && !read; // Compare with last known timestamp
        });
  
        // If there are new notifications, schedule a notification for the latest one
        if (newNotifications.length > 0) {
          const latestNotification = newNotifications[0]; // The most recent new notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: latestNotification.title || "",
              body: latestNotification.body || "",
              data: latestNotification.data || {},
            },
            trigger: null, // Trigger immediately
          });
  
          // Update the last timestamp to the latest notification's timestamp
          lastTimestamp = latestNotification.timestamp || null;
        }
  
        // Map the notifications to the required structure
        const notificationsData: NotificationItem[] = sortedNotifications.map(
          (notification: any) => ({
            id: notification.timestamp, // You can use timestamp as the unique id
            title: notification.title || "",
            body: notification.body || "",
            timestamp: notification.timestamp || null,
            read: notification.read || false,
            data: notification.data || {}, // Ensure 'data' is included if available
          })
        );
  
        updateNotifications(notificationsData); // Update state with fetched notifications
      });
  
      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up notification listener:", error);
    }
  };
  

  // Function to fetch notifications, ordered by latest first (descending order)
  const fetchNotifications = async () => {
    const leaderId = await SecureStore.getItemAsync("accountId"); // Retrieve the leaderId from AsyncStorage
    if (!leaderId) {
      console.error("Leader ID is missing. Cannot fetch notifications.");
      return;
    }

    try {
      // Access the document for the leader in the UserNotificationCollection
      const docRef = doc(db, "UserNotificationCollection", leaderId); // This is a document reference, not a collection!

      // Fetch the document snapshot
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        console.log("No notifications found for this leader.");
        return;
      }

      // Retrieve the notifications array from the document
      const notifications = docSnapshot.data()?.notifications || [];

      // Sort notifications by timestamp in descending order (latest first)
      const sortedNotifications = notifications.sort((a: any, b: any) => {
        const timestampA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timestampB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timestampB - timestampA; // Descending order
      });

      // Map the notifications to the required structure
      const notificationsData: NotificationItem[] = sortedNotifications.map(
        (notification: any) => ({
          id: notification.timestamp, // You can use timestamp as the unique id
          title: notification.title || "",
          body: notification.body || "",
          timestamp: notification.timestamp || null,
          read: notification.read || false,
          data: notification.data || {}, // Ensure 'data' is included if available
        })
      );

      setNotificationList(notificationsData); // Update state with fetched notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Clear notifications from Firestore
  const clearNotifications = async () => {
    const accountId = await SecureStore.getItemAsync("accountId");

    try {
      const batchDelete = notificationList.map((notification) =>
        deleteDoc(doc(db, `${accountId}`, notification.id))
      );

      await Promise.all(batchDelete);
      setNotificationList([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const saveNotificationToFirestore = async (notification: any) => {
    console.log("Saving notification to Firestore:", notification);
    const leaderId = await SecureStore.getItemAsync("accountId"); // Retrieve the leaderId from AsyncStorage
    if (!leaderId) {
      console.error("Leader ID is missing. Notification cannot be saved.");
      return;
    }
  
    try {
      const docRef = doc(db, "UserNotificationCollection", leaderId);
  
      // Use setDoc to create the document if it doesn't exist
      await setDoc(
        docRef,
        {
          notifications: arrayUnion({
            title: notification.title,
            body: notification.body,
            data: notification.data || {},
            timestamp: new Date().toString(),
            read: false,
          }),
        },
        { merge: true } // Merge ensures existing fields are not overwritten
      );
  
      console.log("Notification saved successfully!");
    } catch (error) {
      console.log("Error saving notification:", error);
    }
  };

  const markAllAsRead = async () => {
    const leaderId = await SecureStore.getItemAsync("accountId"); // Retrieve the leaderId from AsyncStorage
    if (!leaderId) {
      console.error("Leader ID is missing. Cannot mark notifications as read.");
      return;
    }

    try {
      // Access the document for the leader in the UserNotificationCollection
      const docRef = doc(db, "UserNotificationCollection", leaderId); // This is a document reference, not a collection!

      // Fetch the document snapshot
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        console.log("No notifications found for this leader.");
        return;
      }

      // Retrieve the notifications array from the document
      const notifications = docSnapshot.data()?.notifications || [];

      // Check if there are any notifications to update
      if (notifications.length === 0) {
        console.log("No notifications to mark as read.");
        return;
      }

      // Update each notification's 'read' field to true
      const updatedNotifications = notifications.map((notification: any) => ({
        ...notification,
        read: true, // Mark as read
      }));

      // Use updateDoc to update the notifications field with the updated notifications array
      await updateDoc(docRef, {
        notifications: updatedNotifications, // Set the updated notifications array
      });

      console.log("All notifications marked as read!");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return {
    notificationList,
    notification,
    expoPushToken,
    configureNotifications,
    getExpoPushTokenAsync,
    sendPushNotification,
    setNotification,
    fetchNotifications,
    clearNotifications,
    markAllAsRead,
    GetLatestPushNotificationRecordByWorkerId,
    AddPushNotificationRecord,
    saveNotificationToFirestore,
    setNotificationList,
    listenToNotifications
  };
};
