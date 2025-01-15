import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  SectionList,
  View,
} from "react-native";
import RenderRequestItem from "@/components/custom_components/RenderRequestItem";
import CustomButton from "@/components/custom_components/CustomButton";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useRequest } from "@/hooks/useRequest";
import { useGlobalState } from "@/context/GlobalProvider";
import EmptyState from "@/components/custom_components/EmptyState";
import { formatDate, useFakeLoading } from "@/utils/utils";
import DateTimePicker from "@react-native-community/datetimepicker";
import IconButton from "@/components/custom_components/IconButton";

const Request = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    newRequests: true,
    inProgressRequests: true,
    completedRequests: true,
    cancelledRequests: true,
  });
  const [fakeLoading, setFakeLoading] = useState(true);
  const {
    selectedRequestFilter,
    setSelectedRequestFilter,
    handleGetRequestList,
    newRequests,
    inProgressRequests,
    completedRequests,
    cancelledRequests,
  } = useRequest();
  const { loading, setLoading } = useGlobalState();
  const navigation = useNavigation();
  useFakeLoading(setFakeLoading)


  type Section =
    | "newRequests"
    | "inProgressRequests"
    | "completedRequests"
    | "cancelledRequests";

  const fetchAllRequests = useCallback(async () => {
    setLoading(true);
    await handleGetRequestList({ status: 0 });
    await handleGetRequestList({ status: 1 });
    await handleGetRequestList({ status: 2 });
    await handleGetRequestList({ status: 3 });
    setLoading(false);
  }, [handleGetRequestList]);

  useEffect(() => {
    fetchAllRequests();
  }, [selectedRequestFilter]);

  const onRefresh = async () => {
    setLoading(true);
    await fetchAllRequests(); // Refetch the data
    setSelectedRequestFilter("");
    setLoading(false);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (Platform.OS === "android" && event.type === "dismissed") {
      return; 
    }
    if (selectedDate) {
      const dateString = selectedDate.toISOString().replace("Z", "");
      setSelectedRequestFilter(dateString);
    }
  };

  const toggleSection = (section: Section) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const sections = [
    { title: "Yêu Cầu Mới", data: newRequests, key: "newRequests" as Section },
    {
      title: "Đang Thực Hiện",
      data: inProgressRequests,
      key: "inProgressRequests" as Section,
    },
    {
      title: "Đã Hoàn Thành",
      data: completedRequests,
      key: "completedRequests" as Section,
    },
    {
      title: "Đã Hủy",
      data: cancelledRequests,
      key: "cancelledRequests" as Section,
    },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${
        selectedRequestFilter
          ? `Yêu cầu ngày: ${formatDate(selectedRequestFilter)}`
          : "Quản lí yêu cầu"
      }`,
      headerTitleAlign: "center",
      headerRight: () => (
        <IconButton
          icon={<FontAwesome5 name="filter" size={20} color="white" />}
          textStyles="text-sm"
          handlePress={() => setShowDatePicker(true)}
          containerStyles="mr-5"
        />
      ),
    });
  }, [navigation, selectedRequestFilter]);

  const allRequestsEmpty =
    !newRequests.length &&
    !inProgressRequests.length &&
    !completedRequests.length &&
    !cancelledRequests.length;

  if (loading || fakeLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="w-full h-full">
      {/* <CustomButton
        title="Tạo mới yêu cầu"
        icon={<AntDesign name="addfolder" size={24} color="white" />}
        containerStyles="mx-5 my-5"
        handlePress={() =>
          router.push("/createRequest/createRequestCustomer")
        }
      /> */}

      {allRequestsEmpty ? (
        <View className="flex-1 justify-center items-center">
          <EmptyState
            title="Không có yêu cầu nào"
            subtitle="Vui lòng kiểm tra lại sau."
            onRefresh={onRefresh}
          />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.get.requestId + index}
          onRefresh={onRefresh}
          refreshing={loading}
          renderSectionHeader={({ section }) => (
            <TouchableOpacity
              onPress={() => toggleSection(section.key)}
              className={`m-2 p-4 flex-row justify-between rounded-full ${
                section.key === "newRequests"
                  ? "bg-[#DBE2EF]"
                  : section.key === "inProgressRequests"
                  ? "bg-[#FFD700]"
                  : section.key === "completedRequests"
                  ? "bg-[#32CD32]"
                  : "bg-[#FF4500]"
              }`}
            >
              <Text className="font-bold text-lg">{section.title}</Text>
              <Text className="font-bold text-lg">
                {section.data.length} Yêu Cầu
              </Text>
            </TouchableOpacity>
          )}
          renderItem={({ item, section }) =>
            !collapsedSections[section.key] ? (
              <View className="p-5">
                <RenderRequestItem
                  requests={[item]}
                  size="small"
                  onRefresh={onRefresh}
                  refreshing={loading}
                />
              </View>
            ) : null
          }
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={
            selectedRequestFilter ? new Date(selectedRequestFilter) : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

export default Request;
