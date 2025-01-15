import React from "react";
import {
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import CustomButton from "./CustomButton";
import { SafeAreaView } from "react-native";
import EmptyState from "./EmptyState";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  image: string | null;
}

const PreRepairEvidenceModal = ({ visible, onClose, image }: ModalProps) => {
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
                  Tình trạng trước khi sửa chữa
                </Text>
                {image || image !== null ? (
                  <Image
                    source={{
                      uri: `${image}&timestamp=${new Date().getTime()}`,
                    }}
                    className="w-80 h-96 mx-auto"
                    resizeMode="contain"
                  />
                ) : (
                  <EmptyState
                    title="Không có hình ảnh"
                    subtitle="Không hình ảnh của tình trạng trước khi sửa"
                  />
                )}

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

export default PreRepairEvidenceModal;
