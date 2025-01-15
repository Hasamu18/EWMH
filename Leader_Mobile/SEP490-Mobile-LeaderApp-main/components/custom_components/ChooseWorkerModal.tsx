import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  Image,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from "react-native-simple-radio-button";
import CustomButton from "./CustomButton";
import { Worker } from "@/model/worker";
import { useWorker } from "@/hooks/useWorker";
import { useGlobalState } from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native";
import { useFakeLoading } from "@/utils/utils";
import { router, useFocusEffect } from "expo-router";
import { useOrder } from "@/hooks/useOrder";
import EmptyState from "./EmptyUserList";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  workers: Worker[];
  orderId: string | string[];
}

const ChooseWorkerModal = ({ visible, onClose, orderId }: ModalProps) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const { handleGetWorker, freeWorker, } = useWorker();
  const { handleAddWorkerToOrder, handleGetOrder, handleGetOrderDetail } = useOrder();

  const { loading, setLoading } = useGlobalState();
  const [fakeLoading, setFakeLoading] = useState(true);
  useFakeLoading(setFakeLoading);

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

  // Log selected worker and close the modal
  const handleSubmit = async () => {
    if (!selectedWorkerId) {
      Alert.alert(
        "Vẫn chưa chọn nhân viên",
        "Hãy chọn nhân viên trước khi tiếp tục"
      );
      return;
    }

    // Format the data as specified
    const formattedData = {
      workerId: selectedWorkerId,
      shippingIdsList: orderId,
    };

    try {
      setLoading(true);
      console.log("Payload: ", formattedData)
      await handleAddWorkerToOrder(formattedData);
      await handleGetOrder(1, 0)
      router.back()
      onClose();
      Alert.alert("Thành công", "Nhân viên đã được gán vào đơn hàng");
      setLoading(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình gửi dữ liệu.");
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
                  Chọn nhân viên
                </Text>
                {loading || fakeLoading ? (
                  <View className="flex-col justify-center items-center p-4 my-5">
                    <ActivityIndicator size="large" color="#5F60B9" />
                  </View>
                ) : freeWorker ? (
                  <RadioForm formHorizontal={false} animation={true}>
                    {freeWorker.map((worker) => (
                      <RadioButton
                        labelHorizontal={true}
                        key={worker.workerInfo.accountId}
                      >
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
                            obj={{
                              label: worker.workerInfo.fullName,
                              value: worker.workerInfo.accountId,
                            }}
                            isSelected={
                              selectedWorkerId === worker.workerInfo.accountId
                            }
                            onPress={() =>
                              setSelectedWorkerId(worker.workerInfo.accountId)
                            }
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
                            buttonWrapStyle={{
                              marginLeft: 10,
                              marginBottom: 25,
                            }}
                          />
                        </View>
                      </RadioButton>
                    ))}
                  </RadioForm>
                ) : (
                  <EmptyState
                    title="Không có nhân viên rảnh"
                    subtitle="Hiện tại không có nhân viên rảnh"
                  />
                )}
                <CustomButton
                  title="Xác nhận"
                  handlePress={handleSubmit}
                  isLoading={loading}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default ChooseWorkerModal;
