import { SCREEN_HEIGHT } from "@/constants/Device";
import { Avatar, Text, VStack } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MyLeaderScreen() {
  return (
    <View style={styles.container}>
      <AvatarSection />
    </View>
  );
}
function AvatarSection() {
  const url =
    "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";
  return (
    <VStack style={styles.avatarContainer} space={3}>
      <Avatar source={{ uri: url }} size="2xl">
        <Avatar.Badge bg="green.500" />
      </Avatar>
      <Text fontSize="xl" fontWeight="bold">
        Nguyễn Văn C
      </Text>
      <Text fontSize="lg">nguyenvanc@gmail.com</Text>
    </VStack>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    height: SCREEN_HEIGHT * 0.92,
  },
  avatarContainer: {
    flex: 3,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
});
