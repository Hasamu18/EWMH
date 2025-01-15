import { GestureResponderEvent, TouchableOpacity, View } from "react-native";
import React from "react";

interface IconButtonProps {
  handlePress?: (event: GestureResponderEvent) => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const IconButton = ({
  handlePress,
  containerStyles,
  isLoading,
  icon,
  disabled,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      className={`bg-[#3F72AF] rounded-xl min-h-[56px] justify-center flex-row items-center ${containerStyles} ${
        isLoading || disabled ? `opacity-50` : ``
      }`}
      disabled={isLoading || disabled}
    >
      <View>{icon}</View>
    </TouchableOpacity>
  );
};

export default IconButton;
