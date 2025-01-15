import { API_Requests_CompleteWarrantyRequest } from "@/api/requests";
import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { CompleteRequest } from "@/models/CompleteRequest";
import { RequestDetails } from "@/models/RequestDetails";

import {
  setConclusion,
  setFinishWarrantyRequestModalState,
  setIsTextInvalid,
} from "@/redux/components/finishWarrantyRequestModalSlice";
import { setIsLoading } from "@/redux/screens/homeScreenSlice";

import { RootState } from "@/redux/store";
import { router } from "expo-router";
import { Button, Modal, Text, TextArea, View } from "native-base";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface FinishWarrantyRequestModalProps {
  requestDetails: RequestDetails;
}

export default function FinishWarrantyRequestModal({
  requestDetails,
}: FinishWarrantyRequestModalProps) {
  const [isFinishing, setIsFinishing] = useState(false);
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const finishWarrantyRequestModalState = useSelector(
    (state: RootState) => state.finishWarrantyRequestModal
  );

  const completeWarrantyRequest = () => {
    if (finishWarrantyRequestModalState.conclusion.length === 0) {
      dispatch(setIsTextInvalid(true));
      return;
    } else dispatch(setIsTextInvalid(false));
    setIsFinishing(true);
    const completeRequest: CompleteRequest = {
      requestId: requestDetails.requestId,
      conclusion: finishWarrantyRequestModalState.conclusion,
      orderCode: null!,
    };
    console.log("lmaoooo: ", completeRequest);
    API_Requests_CompleteWarrantyRequest(completeRequest)
      .then((response) => {
        console.log("response:", response);
        dispatch(setIsLoading(true));
        router.navigate("/(tabs)/home");
      })
      .catch((error) => {
        console.log("Đã có lỗi xảy ra.", error);
      })
      .finally(() => {
        dispatch(setFinishWarrantyRequestModalState(false));
        setIsFinishing(false);
      });
  };
  return (
    <>
      <Modal
        isOpen={finishWarrantyRequestModalState.isOpen}
        onClose={() => dispatch(setFinishWarrantyRequestModalState(false))}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content height={SCREEN_HEIGHT * 0.35}>
          <Modal.CloseButton _icon={{ color: Colors.ewmh.foreground }} />
          <Modal.Header backgroundColor={Colors.ewmh.background}>
            <Text color={Colors.ewmh.foreground} fontWeight="bold">
              Hoàn thành yêu cầu
            </Text>
          </Modal.Header>
          <Modal.Body>
            <EnterConclusionSection />
          </Modal.Body>
          <Modal.Footer>
            {isFinishing ? (
              <ActivityIndicator size="large" />
            ) : (
              <Button onPress={completeWarrantyRequest}>Hoàn tất</Button>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {/* <CustomAlertDialog
            header="Thông báo"
            proceedText="Chấp nhận"
            cancelText=""
            action={() => router.navigate("/(tabs)/home")}
          /> */}
    </>
  );
}
function EnterConclusionSection() {
  const dispatch = useDispatch();
  const conclusion = useSelector(
    (state: RootState) => state.finishWarrantyRequestModal.conclusion
  );
  const isTextInvalid = useSelector(
    (state: RootState) => state.finishWarrantyRequestModal.isTextInvalid
  );
  return (
    <View style={styles.childSections}>
      <Text fontSize="md" fontWeight="bold" marginBottom="3">
        Kết luận
      </Text>
      <TextArea
        h={20}
        autoCompleteType={true}
        placeholder="Lý do..."
        w="100%"
        value={conclusion}
        onChangeText={(text) => dispatch(setConclusion(text))}
        isInvalid={isTextInvalid}
      />
      {isTextInvalid ? (
        <Text style={{ color: Colors.ewmh.danger }}>
          Bạn phải nhập kết luận cho yêu cầu bảo hành này.
        </Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  addProduct: {
    flexDirection: "row",
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  orderButtonText: {
    color: Colors.ewmh.foreground,
  },
  childSections: {
    marginVertical: 1,
  },
});
