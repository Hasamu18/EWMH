import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  handlePress?: (event: GestureResponderEvent) => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  icon,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      className={`bg-[#3F72AF] rounded-xl min-h-[62px] justify-center flex-row items-center ${containerStyles} ${
        isLoading ? `opacity-50` : ``
      }`}
      disabled={isLoading}
    >
      <Text className={`${textStyles} text-white text-lg text-center`}>
        {title}
      </Text>
      {icon && <View className="ml-2">{icon}</View>}

    </TouchableOpacity>
  );
};

export default CustomButton;
