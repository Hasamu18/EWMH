import React, { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { useNotification } from "@/hooks/useNotification";
import { Text } from "react-native";

export default function NotificationListener() {
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const {
    fetchNotifications,
    notification,
    setNotification,
    listenToNotifications,
  } = useNotification();

  // useEffect(() => {
  //   let unsubscribe: (() => void) | undefined;

  //   const setupListener = async () => {
  //     unsubscribe = await listenToNotifications(setNotifications as any);
  //   };

  //   setupListener();

  //   return () => {
  //     if (unsubscribe) unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        console.log("Foreground notification received:", notification);
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      },
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        fetchNotifications();
        console.log("Notification recieved:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <React.Fragment>
      {/* <Text>Title: {notification && notification.request.content.title}</Text>
    <Text>Body: {notification && notification.request.content.body}</Text> */}
    </React.Fragment>
  );
}
