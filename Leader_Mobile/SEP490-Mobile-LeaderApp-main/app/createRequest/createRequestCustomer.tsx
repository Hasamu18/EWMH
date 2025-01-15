import CustomButton from "@/components/custom_components/CustomButton";
import EmptyState from "@/components/custom_components/EmptyUserList";
import FormField from "@/components/custom_components/FormField";
import SearchInput from "@/components/custom_components/SearchInput";
import { useGlobalState } from "@/context/GlobalProvider";
import { useRequest } from "@/hooks/useRequest";
import { CustomerRooms } from "@/model/customer";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const createRequestCustomer = () => {
  const [email_Or_Phone, setEmail_Or_Phone] = useState("");
  const { handleGetCustomerRooms } = useRequest();
  const [customerData, setCustomerData] = useState<CustomerRooms>();
  const { loading, setLoading } = useGlobalState();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    customerId: "",
    roomId: "",
  });
  const timeoutRef = useRef<number | null>(null);


  useEffect(() => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
  
      timeoutRef.current = setTimeout(() => {
        if (email_Or_Phone) {
          fetchCustomerData();
        }
      }, 1000) as unknown as number;
  
      return () => {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
      };
  }, [email_Or_Phone]);


  const fetchCustomerData = async () => {
    if (!email_Or_Phone) return;
    setLoading(true);
    const data = await handleGetCustomerRooms(email_Or_Phone);
    if (data) {
      setCustomerData(data);
      setLoading(false);
    } else {
      setCustomerData(undefined);
      setLoading(false);
      console.log("Failed to fetch customer data");
    }
  };

  const submit = async () => {
    if (form.customerId && form.roomId) {
      navigation.navigate("createRequest", {
        customerId: form.customerId,
        roomId: form.roomId,
      });
    } else {
      console.log("Customer ID or Room ID is missing.");
    }
  };

  const handleSubmitEmail = () => {
    fetchCustomerData(); 
  };

  useEffect(() => {
    if (customerData) {
      setForm({
        customerId: customerData.existingUser[0].accountId || "",
        roomId: customerData.getRooms[0].roomId || "",
      });
    }
  }, [customerData]);

  return (
    <SafeAreaView className="w-full h-full mt-5 px-4">
        <SearchInput
          placeholder="Tìm kiếm bằng SĐT"
          searchQuery={email_Or_Phone}
          setSearchQuery={(e: string) => setEmail_Or_Phone(e)}
          handleSubmitSearch={handleSubmitEmail}
        />
      {customerData && !loading ? (
        <View>
          <View className="bg-[#DBE2EF] rounded-xl p-4 mt-5">
            <View className="flex-row justify-center items-center">
              <Image
                source={{
                  uri: `${customerData.existingUser[0].avatarUrl}&timestamp=${new Date().getTime()}`,
                }}
                className="w-12 h-12 rounded-full mr-5"
              />
              <Text className="text-lg">{customerData.existingUser[0].fullName}</Text>
            </View>
            <View className="flex-col my-3">
              <View className="flex-row items-center my-1">
                <AntDesign name="mail" size={15} color="black" />
                <Text className="text-base ml-2">{customerData.existingUser[0].email}</Text>
              </View>
              <View className="flex-row items-center my-1">
                <FontAwesome name="phone" size={15} color="black" />
                <Text className="text-base ml-2">{customerData.existingUser[0].phoneNumber}</Text>
              </View>
            </View>
          </View>
          <FormField
            title="Số căn hộ"
            value={form.roomId}
            handleChangeText={(e: string) => setForm({ ...form, roomId: e })}
            placeholder="Số căn hộ của khách"
            otherStyles="mt-7"
            isPicker={true}
            pickerOptions={customerData.getRooms.map((room) => ({
              label: room.roomId,
              value: room.roomId,
            }))}
          />
          <CustomButton
            title="Tiếp tục"
            handlePress={submit}
            containerStyles="mt-7 mt-14"
            isLoading={loading}
          />
        </View>
      ) : loading ? (
        <View className="flex-col justify-center items-center p-4 mt-5">
          <ActivityIndicator size="large" color="#5F60B9" />
          <Text>Đang tìm kiếm</Text>
        </View>
      ) :  (
        <EmptyState title="Không tìm thấy khách hàng" subtitle="Yêu cầu phải có thông tin khách hàng" />)}
    </SafeAreaView>
  );
};

export default createRequestCustomer;
