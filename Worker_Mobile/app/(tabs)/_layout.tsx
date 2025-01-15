import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/components/deprecated/useClientOnlyValue";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.ewmh.background,
        headerShown: useClientOnlyValue(false, true),
      }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Yêu cầu của tôi",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="shipping"
        options={{
          title: "Danh sách vận đơn",
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="truck" color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Thông tin cá nhân",

          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.ewmh.background,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
