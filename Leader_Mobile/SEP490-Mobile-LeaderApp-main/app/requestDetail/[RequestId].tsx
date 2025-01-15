import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { Request, RequestDetails } from "@/model/request";
import IconButton from "@/components/custom_components/IconButton";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Foundation,
  Ionicons,
} from "@expo/vector-icons";
import StatusTag from "@/components/custom_components/StatusTag";
import CustomButton from "@/components/custom_components/CustomButton";
import AddModal from "@/components/custom_components/WorkerModal";
import RenderWorkerItem from "@/components/custom_components/RenderRequestedWorkerItem";
import {
  formatCurrency,
  formatDate,
  getCategoryRequest,
  getStatusDetails,
  useFakeLoading,
} from "@/utils/utils";
import RenderRequestDetailItem from "@/components/custom_components/RenderRequestDetailItem";
import ProgressSheet from "@/components/custom_components/ProgressSheet";
import { useGlobalState } from "@/context/GlobalProvider";
import EmptyState from "@/components/custom_components/EmptyState";
import ChooseLeaderModal from "@/components/custom_components/ChooseLeaderModal";
import { useRequest } from "@/hooks/useRequest";
import { Worker } from "@/model/worker";

const requestDetail = () => {
  const params = useLocalSearchParams();
  const RequestId = Array.isArray(params.RequestId)
    ? params.RequestId[0]
    : params.RequestId;
  const navigation = useNavigation();
  const [isWorkerModalVisible, setWorkerModalVisible] = useState(false);
  const [isLeaderModalVisible, setLeaderModalVisible] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<Worker[]>([]);
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(
    null
  );
  const { setIsSheetOpen, setLoading, loading } = useGlobalState();
  const { homeRequest, handleGetRequestDetail, handleGetHomeRequest } =
    useRequest();
  const [fakeLoading, setFakeLoading] = useState(true);
  useFakeLoading(setFakeLoading);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Chi tiết yêu cầu",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
      headerRight: () => (
        <IconButton
          icon={<Foundation name="info" size={30} color="white" />}
          handlePress={() => setIsSheetOpen(true)}
        />
      ),
    });
  }, [navigation]);

  const request = homeRequest.find(
    (item: Request) => item.get.requestId === RequestId
  );

  const fetchAllRequests = useCallback(async () => {
    setLoading(true);
    await handleGetHomeRequest();
    setLoading(false);
  }, [handleGetHomeRequest]);

  useFocusEffect(
    useCallback(() => {
      if (!request) {
        fetchAllRequests();
      }
    }, [request])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchRequestDetail = async () => {
        setLoading(true);
        try {
          const data = await handleGetRequestDetail(RequestId);
          if (data) {
            setRequestDetails(data);
          } else {
            console.log("Failed to fetch request details");
          }
        } catch (error) {
          console.log("Error fetching request details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRequestDetail();
    }, [RequestId, homeRequest])
  );

  const handleOpenWorkerModal = () => {
    setWorkerModalVisible(true);
  };

  const handleCloseWorkerModal = () => {
    setWorkerModalVisible(false);
  };

  const handleCloseLeaderModal = () => {
    setLeaderModalVisible(false);
    setWorkerModalVisible(false);
  };

  const handleWorkerSubmission = (workers: Worker[]) => {
    // if (selectedWorkers.length === 1 && freeWorker.length > 1) {
    //   Alert.alert("Bạn chắc chắn chưa?", "Bạn mới chỉ chọn 1 nhân viên", [
    //     {
    //       text: "Hủy",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel",
    //     },
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         setSelectedWorkers(workers);
    //         setLeaderModalVisible(true);
    //       },
    //     },
    //   ]);
    // }
    // else if(selectedWorkers.length > 1 && freeWorker.length > 1){
    setSelectedWorkers(workers);
    setLeaderModalVisible(true);
    // } else if(selectedWorkers.length === 1 && freeWorker.length === 1){
    //   return;
    // }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => setIsSheetOpen(false);
    }, [setIsSheetOpen])
  );

  if (fakeLoading || loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <EmptyState
        title="Không có yêu cầu"
        subtitle="Không tìm yêu cầu mà bạn cần"
      />
    );
  }

  return (
    <SafeAreaView className="p-4 flex-1">
      <ScrollView>
        <View className="flex-row justify-between">
          <View className="">
            <Text className="text-base text-gray-500 mb-10">Mã yêu cầu:</Text>
            <Text className="text-base text-gray-500 mb-10">
              {" "}
              Loại sửa chữa:
            </Text>
            <Text className="text-base text-gray-500 mb-10">Ngày bắt đầu:</Text>
            {request.get.end && (
              <Text className="text-base text-gray-500">Ngày kết thúc:</Text>
            )}
          </View>
          <View className="flex items-end">
            <Text className="text-base text-right mb-10 mr-3">
              {request.get.requestId}
            </Text>
            <Text className="text-base mb-10">
              <StatusTag
                status={getCategoryRequest(request.get.categoryRequest)}
                size="big"
              />
            </Text>
            <Text className="text-base text-right mb-10 mr-3">
              {formatDate(request.get.start)}
            </Text>
            {request.get.end && (
              <Text className="text-base text-right mb-10 mr-3">
                {formatDate(request.get.end)}
              </Text>
            )}
          </View>
        </View>
        <Text className="text-2xl text-center my-4 font-bold">
          Thông tin khách hàng
        </Text>
        <View className="bg-[#DBE2EF] rounded-xl py-4">
          {request.get.contractId !== null ? (
            <View className="bg-green-500 flex-row p-2 mb-5">
              <Text className="text-center w-full text-lg font-bold">
                Có gói dịch vụ
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View className="flex-row justify-center items-center">
            <Image
              source={{
                uri: `${
                  request.getCustomer.avatarUrl
                }&timestamp=${new Date().getTime()}`,
              }}
              className="w-12 h-12 rounded-full mr-5"
            />
            <Text className="text-lg">{request.getCustomer.fullName}</Text>
          </View>
          <View className="pl-4">
            <View className="flex-col my-3">
              <View className="flex-row items-center my-1">
                <AntDesign name="mail" size={15} color="black" />
                <Text className="text-base ml-2">
                  {request.getCustomer.email}
                </Text>
              </View>
              <View className="flex-row items-center my-1">
                <Entypo name="home" size={24} color="black" />
                <Text className="text-base ml-2">{request.get.roomId}</Text>
              </View>
              <View className="flex-row items-center my-1">
                <Entypo name="location-pin" size={15} color="black" />
                <Text className="text-base ml-2">
                  {request.getApartment.address}
                </Text>
              </View>
              <View className="flex-row items-center my-1">
                <FontAwesome name="phone" size={15} color="black" />
                <Text className="text-base ml-2">
                  {request.getCustomer.phoneNumber}
                </Text>
              </View>
            </View>
            <View>
              <Text className="underline text-lg mb-2">Chi tiết yêu cầu:</Text>
              <Text>{request.get.customerProblem}</Text>
            </View>
          </View>
        </View>
        <Text className="text-2xl text-center my-4 font-bold">
          Danh sách nhân viên
        </Text>
        {requestDetails?.[0].workerList &&
          requestDetails?.[0].workerList.length === 0 &&
          request.get.status !== 3 && (
            <CustomButton
              title="Thêm nhân viên"
              icon={
                <Ionicons name="add-circle-outline" size={24} color="white" />
              }
              containerStyles="my-5"
              handlePress={handleOpenWorkerModal}
              isLoading={loading}
            />
          )}
        {!loading ? (
          <RenderWorkerItem workers={requestDetails?.[0]?.workerList || []} />
        ) : (
          <SafeAreaView className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#5F60B9" />
          </SafeAreaView>
        )}
        {requestDetails?.[0]?.productList &&
        requestDetails?.[0]?.productList.length > 0 &&
        request.get.status !== 0 ? (
          <>
            <Text className="text-2xl text-center my-4 font-bold">
              Đơn hàng đính kèm
            </Text>
            <View className="flex-col">
              <View>
                <Text className="text-base">
                  Ngày mua:{" "}
                  {requestDetails?.[0].request.purchaseTime
                    ? formatDate(requestDetails?.[0].request.purchaseTime)
                    : "Không có dữ liệu"}
                </Text>
                <View className="flex-row justify-between items-center px-2 my-5">
                  <Text className="p-2 border border-black rounded">
                    {requestDetails?.[0].productList?.length} sản phẩm
                  </Text>
                  <Text className="text-[#3F72AF] text-base">
                    {formatCurrency(requestDetails?.[0].request.totalPrice)}
                  </Text>
                </View>
              </View>
            </View>
            {!loading ? (
              <RenderRequestDetailItem
                details={requestDetails?.[0].productList || []}
              />
            ) : (
              <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#5F60B9" />
              </SafeAreaView>
            )}
          </>
        ) : (
          <></>
        )}
      </ScrollView>
      <ChooseLeaderModal
        visible={isLeaderModalVisible}
        onClose={handleCloseLeaderModal}
        workers={selectedWorkers}
        requestId={request.get.requestId}
      />
      <AddModal
        visible={isWorkerModalVisible}
        onClose={handleCloseWorkerModal}
        onSubmit={handleWorkerSubmission}
        requestId={request.get.requestId}
      />
      <ProgressSheet
        id={request.get.requestId}
        fileUrl={request.get.postRepairEvidenceUrl || null}
        status={getStatusDetails(request.get.status)}
        report={request.get.conclusion || "Chưa có báo cáo"}
        image={request.get.preRepairEvidenceUrl || null}
      />
    </SafeAreaView>
  );
};

export default requestDetail;
