import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

interface DatePickerProps {
  title: string;
  values?: string;
  placeholder: string;
  otherStyles?: string;
  handlePress: (event: GestureResponderEvent) => void;
}

const DatePicker = ({
  title,
  values,
  placeholder,
  otherStyles,
  handlePress
}: DatePickerProps) => {

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-lg text-black ">{title}</Text>
      <TouchableOpacity onPress={handlePress} className="bg-[#DBE2EF] w-full h-14 px-4 bg-black-100 rounded-2xl focus:border-secondary-100 items-center flex-row">
        
        {values ? <Text className="flex-1 text-black font-psemibold text-base">{values}</Text> : <Text className="flex-1 text-[#7b7b8b] font-psemibold text-base">{placeholder}</Text>}
        <Feather name="calendar" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default DatePicker;
