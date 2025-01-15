import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Alert,
  SafeAreaView,
} from "react-native";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import { useGlobalState } from "@/context/GlobalProvider";
import { useRequest } from "@/hooks/useRequest";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  requestId: string;
}

const CancelRequestModal = ({ visible, onClose, requestId }: ModalProps) => {
  const [form, setForm] = useState({ conclusion: "" });
  const { handleCancelRequest, handleGetHomeRequest, handleGetRequestList } =
    useRequest();
  const { loading, setLoading } = useGlobalState();

  const handleSubmit = async () => {
    if (!form.conclusion.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do hủy yêu cầu.");
      return;
    }

    if (!requestId) {
      Alert.alert("Lỗi", "Không tìm thấy mã yêu cầu.");
      return;
    }

    const formattedData = {
      requestId,
      conclusion: form.conclusion,
    };

    try {
      setLoading(true);
      await handleCancelRequest(formattedData);
      onClose(); // Close modal after submission
      // Refresh requests
      await handleGetHomeRequest();
      await Promise.all([
        handleGetRequestList({ status: 0 }),
        handleGetRequestList({ status: 1 }),
        handleGetRequestList({ status: 2 }),
        handleGetRequestList({ status: 3 }),
      ]);
      Alert.alert("Thành công", "Yêu cầu đã hủy thành công");
      setLoading(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi hủy yêu cầu.");
      setLoading(false);
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
                  Huỷ Yêu Cầu
                </Text>
                <FormField
                  title="Lí do hủy"
                  value={form.conclusion}
                  handleChangeText={(text: string) =>
                    setForm({ ...form, conclusion: text })
                  }
                  placeholder="Mô tả lý do bạn muốn hủy yêu cầu"
                  otherStyles="mt-5"
                  containerStyles="h-24 p-4 my-4"
                  textAlignVertical="top"
                  multiline
                  numberOfLines={5}
                  maxLength={720}
                />
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

export default CancelRequestModal;
