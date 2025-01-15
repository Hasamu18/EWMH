import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { useNotification } from "@/hooks/useNotification"; // Import the listener function
import CustomButton from "@/components/custom_components/CustomButton";
import { router } from "expo-router";

const NotificationScreen = () => {
  const { saveNotificationToFirestore } = useNotification();




  return (
    <View style={styles.container}>
      <CustomButton
        title="Send to Firestore"
        handlePress={() =>
          saveNotificationToFirestore({
            title: "Thong bao title",
            body: "Thong bao body",
            data: { data: "Thong bao data" },
          })
        }
      />
      <CustomButton
        title="Pdf View"
        handlePress={() => router.push(`/requestPdfViewer/1`)
        }
      />
{/* 
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      /> */}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  notificationItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    fontSize: 14,
    color: "#555",
  },
  timestamp: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
});
