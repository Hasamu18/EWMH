import React from "react";
import {
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

import CustomButton from "./CustomButton";
import { SafeAreaView } from "react-native";
import { router } from "expo-router";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  report: string;
  requestId: string;
  fileUrl: string | null;
  status: string;
}

const ReportModal = ({
  visible,
  onClose,
  report,
  requestId,
  fileUrl,
  status,
}: ModalProps) => {
  console.log("Request ID in Modal", requestId);
  console.log("FileUrl in Modal", fileUrl);
  const closeModal = () => {
    onClose();
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
                  {status === "Đã Hủy" ? "Lí do hủy" : "Báo cáo" }
                </Text>
                <Text>{report}</Text>
                {status === "Hoàn Thành" || status === "Đã Hủy" ?(
                  <CustomButton
                    title="Xem bằng chứng và nghiệm thu"
                    handlePress={() => {
                      router.push(`/requestPdfViewer/${requestId}`);
                      console.log("Transfering request ID:", requestId);
                    }}
                    isLoading={ 
                        fileUrl === null
                    }
                    containerStyles="my-4"
                  />
                ) : null}
                <CustomButton
                  title="Xác nhận"
                  handlePress={closeModal}
                  containerStyles="my-4"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default ReportModal;
