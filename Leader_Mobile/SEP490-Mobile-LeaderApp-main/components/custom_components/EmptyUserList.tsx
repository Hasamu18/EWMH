import { View, Text, Image } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { useGlobalState } from "@/context/GlobalProvider";

interface EmptyStateProps {
    title: string;
    subtitle: string;
    onRefresh?: () => void;
  }

const EmptyState = ({ title, subtitle, onRefresh}: EmptyStateProps) => {
  const {loading} = useGlobalState()
  return (
    <View className="justify-center items-center  px-4">
      <Image
        source={require("../../assets/images/image 65.png")}
        className="w-[300px] h-[300px]"
        resizeMode="contain"
      />
      <Text className="text-2xl text-center text-black font-bold">{title}</Text>
      <Text className="text-base text-gray-500 mt-2">{subtitle}</Text>
      {onRefresh &&
              <CustomButton
              title="Tải lại"
              handlePress={onRefresh}
              containerStyles="mt-14 px-10"
              
            />
      }
    </View>
  );
};

export default EmptyState;
