import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { TextInputProps } from "@ant-design/react-native/lib/input-item";

interface FormFieldProps extends TextInputProps {
  title: string;
  value?: string;
  placeholder: string;
  handleChangeText?: (text: string) => void;
  otherStyles?: string;
  icon?: React.ReactNode;
  containerStyles?: string;
  isPicker?: boolean;
  pickerOptions?: { label: string; value: string }[];
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  icon,
  containerStyles,
  isPicker = false,
  pickerOptions = [],
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");


  useEffect(() => {
    if(value){
    setSelectedValue(value)
    }
  }, [value])
  

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-lg text-black ">{title}</Text>
      <View className={`bg-[#DBE2EF] w-full h-14 px-4 bg-black-100 rounded-2xl focus:border-secondary-100 items-center flex-row ${containerStyles}`}>
        {isPicker ? (
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => {
              setSelectedValue(itemValue);
              if (handleChangeText) handleChangeText(itemValue);
            }}
            style={{ flex: 1, color: "#000" }}
          >
            {pickerOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        ) : (
          <TextInput
            className="flex-1 text-black font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === "Mật khẩu" && !showPassword}
            {...props}
          />
        )}
        {title === "Mật khẩu" && !isPicker ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {!showPassword ? (
              <AntDesign name="eye" size={24} color="black" />
            ) : (
              <Entypo name="eye-with-line" size={24} color="black" />
            )}
          </TouchableOpacity>
        ) : (
          icon && icon
        )}
      </View>
    </View>
  );
};

export default FormField;
