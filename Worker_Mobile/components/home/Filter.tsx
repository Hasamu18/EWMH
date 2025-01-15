import Colors from "@/constants/Colors";
import { Button, Modal, Text, VStack } from "native-base";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const [date, setDate] = useState(new Date());

  const startFilter = () => {
    onClose();
  };
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content>
          <Modal.CloseButton _icon={{ color: Colors.ewmh.foreground }} />
          <Modal.Header backgroundColor={Colors.ewmh.background}>
            <Text color={Colors.ewmh.foreground} fontWeight="bold">
              Lọc theo ngày
            </Text>
          </Modal.Header>
          <Modal.Body>
            <VStack style={styles.datePicker}>
              {/* <LabeledDatePicker label="Ngày bắt đầu" />
              <LabeledDatePicker label="Ngày kết thúc" /> */}
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={startFilter}>Chấp nhận</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",

    justifyContent: "center",
    marginBottom: 10,
  },
  datePicker: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
