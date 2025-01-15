import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Fragment } from "react";

export default function TabLayout() {
  return (
    <Fragment>
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#3F72AF",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: { height: 70, backgroundColor: "#DBE2EF" },
        headerStyle: {backgroundColor:"#4072AF"},
        headerTintColor:"white",
        headerTitleAlign: "center", 
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          headerShown: true,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Entypo name="home" size={20} color={color} />
            ) : (
              <MaterialCommunityIcons
                name="home-outline"
                size={20}
                color={color}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "Quản lí yêu cầu",
          headerShown: true,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FontAwesome5 name="wrench" size={20} color={color} />
            ) : (
              <SimpleLineIcons name="wrench" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Vật tư điện nước",
          headerShown: true,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FontAwesome5 name="shopping-cart" size={20} color={color} />
            ) : (
              <AntDesign name="shoppingcart" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Quản lí đơn hàng",
          headerShown: true,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Entypo name="shopping-bag" size={20} color={color} />
            ) : (
              <Feather name="shopping-bag" size={20} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="contract"
        options={{
          title: "Quản lí hợp đồng",
          headerShown: true,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FontAwesome name="file-text" size={20} color={color} />
            ) : (
              <FontAwesome name="file-text-o" size={20} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ cá nhân",
          headerShown: true,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FontAwesome5 name="user-alt" size={20} color={color} />
            ) : (
              <FontAwesome5 name="user" size={20} color={color} />
            ),
        }}
      />
      {/* <Tabs.Screen
        name="notification"
        options={{
          title: "Trang test thông báo",
          headerShown: true,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FontAwesome5 name="user-alt" size={20} color={color} />
            ) : (
              <FontAwesome5 name="user" size={20} color={color} />
            ),
        }}
      /> */}
    </Tabs>
    <StatusBar backgroundColor="#4072AF" style="light"/>
    </Fragment>
  );
}
