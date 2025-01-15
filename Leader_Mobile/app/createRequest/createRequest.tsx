import { View, Text, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import FormField from "@/components/custom_components/FormField";
import StatusTag from "@/components/custom_components/StatusTag";
import CustomButton from "@/components/custom_components/CustomButton";
import { RouteProp, useRoute } from "@react-navigation/native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from "react-native-simple-radio-button";
import { useRequest } from "@/hooks/useRequest";
import { useGlobalState } from "@/context/GlobalProvider";

interface RouteParams {
  customerId: string;
  roomId: string;
}

const CreateRequest = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { customerId, roomId } = route.params;
  const {
    customerProblemError,
    handleCreateRequest,
    handleGetHomeRequest,
    handleGetRequestList,
  } = useRequest();
  const { loading, setLoading } = useGlobalState();
  const [form, setForm] = useState({
    customerId: customerId || "",
    roomId: roomId || "",
    customerProblem: "",
    categoryRequest: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(0);

  const radioOptions = [
    { label: "Bảo Hành", value: 0 },
    { label: "Sửa Chữa", value: 1 },
  ];

  const submit = async () => {
    setLoading(true);

    const requestData = {
      customerId: form.customerId,
      roomId: form.roomId,
      customerProblem: form.customerProblem,
      categoryRequest: form.categoryRequest,
    };

    const result = await handleCreateRequest(requestData);

    if (result) {
      await handleGetHomeRequest();
      await handleGetRequestList({ status: 0 });
      await handleGetRequestList({ status: 1 });
      await handleGetRequestList({ status: 2 });
      await handleGetRequestList({ status: 3 });
      Alert.alert("Thành công", "Yêu cầu mới đã được tạo thành công");
      setLoading(false);
      router.replace("/(tabs)/request");
    }
    else {
      console.log("Create Request Error")
      setLoading(false)
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="w-full h-full mt-5 px-4">
      <View>
        <Text className="text-lg mb-8">Loại yêu cầu:</Text>
        <RadioForm formHorizontal={false} animation={true}>
          {radioOptions.map((option, index) => (
            <RadioButton labelHorizontal={true} key={option.value}>
              <View className="flex-row justify-between w-full">
                <StatusTag
                  status={option.label}
                  size="big"
                  containerStyle="mb-[25]"
                  onPress={() => setSelectedCategory(option.value)}
                />
                <RadioButtonInput
                  obj={option}
                  index={index}
                  isSelected={selectedCategory === option.value}
                  onPress={() => {
                    setSelectedCategory(option.value);
                    setForm({ ...form, categoryRequest: option.value });
                  }}
                  borderWidth={1}
                  buttonInnerColor={"#3F72AF"}
                  buttonOuterColor={
                    selectedCategory === option.value ? "#2196f3" : "#000"
                  }
                  buttonSize={10}
                  buttonOuterSize={20}
                  buttonStyle={{}}
                  buttonWrapStyle={{ marginLeft: 10, marginBottom: 25 }}
                />
              </View>
            </RadioButton>
          ))}
        </RadioForm>
      </View>

      <FormField
        title="Mô tả yêu cầu"
        value={form.customerProblem}
        handleChangeText={(e: string) =>
          setForm({ ...form, customerProblem: e })
        }
        placeholder="Mô tả vấn đề của khách hàng"
        otherStyles="mt-5"
        containerStyles="h-24 p-4"
        textAlignVertical="top"
        multiline
        numberOfLines={20}
        maxLength={720}
      />
      {customerProblemError ? (
        <Text className="text-red-500 absolute font-bold bottom-[314px] left-4">
          {customerProblemError}
        </Text>
      ) : null}

      <CustomButton
        title="Tạo yêu cầu"
        handlePress={submit}
        containerStyles="mt-7 mt-14"
        isLoading={loading}
      />
    </SafeAreaView>
  );
};

export default CreateRequest;
