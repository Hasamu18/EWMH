import CompletedRequestTabView from "@/components/completedRequests/CompletedRequestTabView";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function CompletedRequestsScreen() {
  return (
    <View style={styles.container}>
      <CompletedRequestTabView />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
