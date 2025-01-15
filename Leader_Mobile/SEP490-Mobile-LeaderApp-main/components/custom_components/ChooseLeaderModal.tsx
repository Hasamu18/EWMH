import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from "react-native-simple-radio-button";
import CustomButton from "./CustomButton";
import { Worker } from "@/model/worker";
import { useWorker } from "@/hooks/useWorker";
import { useGlobalState } from "@/context/GlobalProvider";
import { useRequest } from "@/hooks/useRequest";
import { SafeAreaView } from "react-native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  workers: Worker[];
  requestId: string
}

const ChooseLeaderModal = ({ visible, onClose, workers, requestId }: ModalProps) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const { handleAddWorkerToRequest, handleGetWorker } = useWorker();
  const { loading, setLoading} = useGlobalState()
  const { handleGetHomeRequest, handleGetRequestList } = useRequest();



  // Log selected worker and close the modal
  const handleSubmit = async () => {
    if (!selectedWorkerId) {
      Alert.alert("Vẫn chưa chọn nhân viên chính", "Hãy chọn nhân viên chính trước khi tiếp tục");
      return;
    }

    // Format the data as specified
    const formattedData = {
      requestId,
      workerList: workers.map((worker) => ({
        workerId: worker.workerId,
        isLead: worker.workerId === selectedWorkerId, 
      })),
    };

    try {
      setLoading(true)
      await handleAddWorkerToRequest(formattedData);
      onClose();
      await handleGetWorker(true)
      await handleGetHomeRequest()
      await handleGetRequestList({ status: 0 });
      await handleGetRequestList({ status: 1 });
      await handleGetRequestList({ status: 2 });
      await handleGetRequestList({ status: 3 });
      setLoading(false)
      Alert.alert("Thành công", "Nhân viên đã được gán vào yêu cầu");
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình gửi dữ liệu.");
      setLoading(false)
    }
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
                Thêm nhân viên chính
              </Text>
              <RadioForm formHorizontal={false} animation={true}>
                {workers.map((worker) => (
                  <RadioButton labelHorizontal={true} key={worker.workerInfo.accountId}>
                    <View className="flex-row items-center justify-between w-full my-2">
                      <View className="flex-row items-center mb-[25]">
                          <Image
                            source={{ uri: worker.workerInfo.avatarUrl }}
                            className="w-12 h-12 rounded-full mx-2"
                          />
                          <View className="ml-2">
                            <Text className="text-lg font-bold">
                              {worker.workerInfo.fullName}
                            </Text>
                            <Text className="text-sm text-gray-600">
                              {worker.workerInfo.phoneNumber}
                            </Text>
                          </View>
                      </View>
                      <RadioButtonInput
                        obj={{ label: worker.workerInfo.fullName, value: worker.workerInfo.accountId }}
                        isSelected={selectedWorkerId === worker.workerInfo.accountId}
                        onPress={() => setSelectedWorkerId(worker.workerInfo.accountId)}
                        borderWidth={1}
                        buttonInnerColor={"#3F72AF"}
                        buttonOuterColor={
                          selectedWorkerId === worker.workerInfo.accountId
                            ? "#2196f3"
                            : "#000"
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
              <CustomButton title="Xác nhận" handlePress={handleSubmit} isLoading={loading}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </SafeAreaView>
  );
};

export default ChooseLeaderModal;
