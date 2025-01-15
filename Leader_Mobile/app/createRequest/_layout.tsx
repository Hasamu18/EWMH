import React from "react";
import { Stack } from "expo-router";

const createRequestLayout = () => {
  return (
    <Stack
      initialRouteName="createRequestCustomer"
      screenOptions={{
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#4072AF" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="createRequestCustomer"
        options={{ headerTitle: "Tạo yêu cầu" }}
      />
      <Stack.Screen
        name="createRequest"
        options={{ headerTitle: "Tạo yêu cầu" }}
      />
    </Stack>
  );
};

export default createRequestLayout;
