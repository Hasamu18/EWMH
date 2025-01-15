import { FlatList, TouchableOpacity, Text, View } from "react-native";
import React, { ReactNode } from "react";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export interface Option {
  icon: ReactNode;
  title: string;
  route: string;
}

interface RenderOptionItemProps {
  options: Option[];
}

const RenderOptionItem = ({ options }: RenderOptionItemProps) => {
  const renderItem = ({ item }: { item: Option }) => (
    <TouchableOpacity
      onPress={() => router.push(item.route)}
      className="flex-row items-center justify-between px-3 py-5"
    >
      <View className="flex-row">
        {item.icon}
        <Text className="ml-3 text-base font-semibold">{item.title}</Text>
      </View>
      <AntDesign name="right" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={options}
      renderItem={renderItem}
      keyExtractor={(item) => item.route}
    />
  );
};

export default RenderOptionItem;
