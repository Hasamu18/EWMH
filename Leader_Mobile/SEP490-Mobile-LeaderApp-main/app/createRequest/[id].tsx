import {
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/custom_components/CustomButton";
import FormField from "@/components/custom_components/FormField";
import { useRequest } from "@/hooks/useRequest";
import { useGlobalState } from "@/context/GlobalProvider";
import { CustomerRooms } from "@/model/customer";
import { Request } from "@/model/request";
import EmptyState from "@/components/custom_components/EmptyUserList";

const EditRequest = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const navigation = useNavigation();
  const {
    handleGetHomeRequest,
    handleGetRequestList,
    handleGetCustomerRooms,
    handleRequestUpdate,
    homeRequest,
    customerProblemError,
  } = useRequest();
  const { loading, setLoading } = useGlobalState();
  const [customerData, setCustomerData] = useState<CustomerRooms>();
  const [form, setForm] = useState({
    requestId: "",
    roomId: "",
    customerProblem: "",
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Chỉnh sửa yêu cầu",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
    });
  }, [navigation]);

  useEffect(() => {
    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  const request = homeRequest.find(
    (item: Request) => item.get.requestId === id
  );

  const fetchCustomerData = async () => {
    setLoading(true);
    const data = await handleGetCustomerRooms(
      request?.getCustomer.phoneNumber || request?.getCustomer.email || ""
    );
    if (data) {
      setCustomerData(data);
      
      setForm({
        requestId: request?.get.requestId || "",
        roomId: request?.get.roomId || "",
        customerProblem: request?.get.customerProblem || "",
      });
    } else {
      console.log("Failed to fetch customer data");
    }
    setLoading(false);
  };

  const submit = async () => {
    setLoading(true);
    const response = await handleRequestUpdate({
      requestId: form.requestId,
      roomId: form.roomId,
      customerProblem: form.customerProblem,
    });
    if (response) {
      console.log("Request successfully updated!");
      await handleGetHomeRequest();
      await handleGetRequestList({ status: 0 });
      await handleGetRequestList({ status: 1 });
      await handleGetRequestList({ status: 2 });
      await handleGetRequestList({ status: 3 });
      navigation.goBack();
      Alert.alert("Thành công", "Yêu cầu đã được chỉnh sửa thành công");
      setLoading(false);
    } else {
      console.log("Request Edit Error:", customerProblemError);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="w-full h-full px-4">
      {loading ? (
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#5F60B9" />
        </SafeAreaView>
      ) : customerData ? (
        <>
          <View className="bg-[#DBE2EF] rounded-xl p-4 mt-5">
            <View className="flex-row justify-center items-center">
              <Image
                source={{
                  uri: `${
                    customerData.existingUser[0].avatarUrl
                  }&timestamp=${new Date().getTime()}`,
                }}
                className="w-12 h-12 rounded-full mr-5"
              />
              <Text className="text-lg">
                {customerData.existingUser[0].fullName}
              </Text>
            </View>
            <View className="flex-col my-3">
              <View className="flex-row items-center my-1">
                <AntDesign name="mail" size={15} color="black" />
                <Text className="text-base ml-2">
                  {customerData.existingUser[0].email}
                </Text>
              </View>
              <View className="flex-row items-center my-1">
                <FontAwesome name="phone" size={15} color="black" />
                <Text className="text-base ml-2">
                  {customerData.existingUser[0].phoneNumber}
                </Text>
              </View>
            </View>
          </View>
          <FormField
            title="Số căn hộ"
            value={form.roomId}
            handleChangeText={(e) => setForm({ ...form, roomId: e })}
            placeholder="Chọn căn hộ"
            otherStyles="mt-7"
            isPicker={true}
            pickerOptions={customerData.getRooms.map((room) => ({
              label: room.roomId,
              value: room.roomId,
            }))}
          />

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
            <Text className="text-red-500 absolute font-bold bottom-[234px] left-4">
              {customerProblemError}
            </Text>
          ) : null}

          <CustomButton
            title="Lưu thay đổi"
            handlePress={submit}
            containerStyles="mt-7 mt-14"
          />
        </>
      ) : (
        <EmptyState
          title="Không tìm thấy khách hàng"
          subtitle="Yêu cầu phải có thông tin khách hàng"
        />
      )}
    </SafeAreaView>
  );
};

export default EditRequest;
