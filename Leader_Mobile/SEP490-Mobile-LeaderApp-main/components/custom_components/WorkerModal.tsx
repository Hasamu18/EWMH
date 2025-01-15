import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Worker } from "@/model/worker";
import CustomButton from "./CustomButton";
import { useWorker } from "@/hooks/useWorker";
import { useGlobalState } from "@/context/GlobalProvider";
import EmptyState from "./EmptyUserList";
import { useRequest } from "@/hooks/useRequest";
import { useFocusEffect } from "expo-router";
import { useFakeLoading } from "@/utils/utils";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (workers: Worker[]) => void;
  requestId: string
}

const AddModal = ({ visible, onClose, onSubmit, requestId }: ModalProps) => {
  const [selectedWorkers, setSelectedWorkers] = useState<Worker[]>([]);
  const { freeWorker, handleGetWorker, handleAddWorkerToRequest } = useWorker();
  const { loading, setLoading } = useGlobalState();
  const { handleGetHomeRequest, handleGetRequestList } = useRequest();
  const [fakeLoading, setFakeLoading] = useState(true);
  useFakeLoading(setFakeLoading)

  const fetchWorker = useCallback(async () => {
    await handleGetWorker(true);
  }, []);


  useFocusEffect(
    useCallback(() => {
      if (!freeWorker) {
        setLoading(true);
        fetchWorker();
        setLoading(false);
      }
    }, [visible])
  );
  
  useEffect(() => {
    fetchWorker();
  }, [visible]);

  // Toggle selection of a worker
  const toggleSelectWorker = (worker: Worker) => {
    setSelectedWorkers((prev) =>
      prev.includes(worker)
        ? prev.filter(
            (workerId) =>
              workerId.workerInfo.accountId !== worker.workerInfo.accountId
          )
        : [...prev, worker]
    );
  };

  // Log selected workers and close the modal
  const submitSelection = async () => {
    if (selectedWorkers.length === 0) {
      Alert.alert("Vẫn chưa chọn nhân viên", "Hãy chọn nhân viên trước khi tiếp tục");
      return;
    }
  
    const formattedData = {
      requestId,
      workerList: selectedWorkers.map((worker, index) => ({
        workerId: worker.workerId,
        isLead: index === 0, 
      })),
    };
  
    try {
      if(selectedWorkers.length === 1){
        setLoading(true)
        await handleAddWorkerToRequest(formattedData);
        setSelectedWorkers([]);
        onClose()
        await handleGetWorker(true)
        await handleGetHomeRequest()
        await handleGetRequestList({ status: 0 });
        await handleGetRequestList({ status: 1 });
        await handleGetRequestList({ status: 2 });
        await handleGetRequestList({ status: 3 });
        setLoading(false)
        Alert.alert("Thành công", "Nhân viên đã được gán vào yêu cầu");
      }
      else{
        onSubmit(selectedWorkers)
      }
    } catch (error) {
      console.error("Error submitting workers:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình gửi dữ liệu.");
      setLoading(false)
    }
  };

  
  

  // Render each worker item
  const renderWorkerItem = ({ item }: { item: Worker }) => {
    const isSelected = selectedWorkers.some(
      (worker) => worker.workerInfo.accountId === item.workerInfo.accountId
    );

    return (
      <TouchableOpacity onPress={() => toggleSelectWorker(item)}>
        <View className="flex-row items-center p-2">
          <Image
            source={{ uri: item.workerInfo.avatarUrl }}
            className="w-12 h-12 rounded-full mx-2"
          />
          <View className="flex-1 ml-2">
            <Text className="text-lg font-bold">
              {item.workerInfo.fullName}
            </Text>
            <Text className="text-sm text-gray-600">
              {item.workerInfo.phoneNumber}
            </Text>
          </View>
          <Checkbox
            value={isSelected}
            onValueChange={() => toggleSelectWorker(item)}
            color={isSelected ? "#3F72AF" : undefined}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="w-4/5 p-5 bg-white rounded-lg">
              <Text className="text-xl text-center text-[#3F72AF] font-bold mb-4">
                Thêm nhân viên
              </Text>
              {loading || fakeLoading ? (
                <View className="flex-col justify-center items-center p-4 my-5">
                  <ActivityIndicator size="large" color="#5F60B9" />
                </View>
              ) : (
                <>
                <FlatList
                  data={freeWorker}
                  keyExtractor={(item) => item.workerInfo.accountId}
                  renderItem={renderWorkerItem}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={
                    <EmptyState
                      title="Không có nhân viên rảnh"
                      subtitle="Hiện tại không có nhân viên rảnh"
                    />
                  }
                />
                <CustomButton title="Tiếp tục" handlePress={submitSelection} isLoading={loading}/>
                </>
              )}

              
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </SafeAreaView>
  );
};

export default AddModal;
