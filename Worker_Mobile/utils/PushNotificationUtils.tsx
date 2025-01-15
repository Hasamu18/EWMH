import {
  FIREBASE_CONFIG,
  LEADER_TO_WORKER_COLLECTION,
} from "@/constants/FirebaseConfig";
import { PushNotificationRecord } from "@/models/PushNotificationRecord";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export function InitializeFirestoreDb(): Firestore {
  const app = initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);
  return db;
}

export async function AddPushNotificationRecord(
  db: Firestore,
  pnRecord: PushNotificationRecord
) {
  try {
    const docRef = await addDoc(
      collection(db, LEADER_TO_WORKER_COLLECTION),
      pnRecord
    );
    console.log("docRef:", docRef);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function GetLatestPushNotificationRecordByWorkerId(
  db: Firestore,
  workerId: string
): Promise<PushNotificationRecord | null> {
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
}
