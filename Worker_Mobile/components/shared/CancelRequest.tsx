import { API_Requests_CancelRequest } from "@/api/requests";
import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { COMPLETED } from "@/constants/Request";
import { CancelRequest } from "@/models/CancelRequest";
import { RequestDetails } from "@/models/RequestDetails";
import {
  setCancelRequestModalState,
  setRequestId,
} from "@/redux/components/cancelRequestModalSlice";
import { setIsLoading } from "@/redux/screens/homeScreenSlice";
import { RootState } from "@/redux/store";
import { IsLeadWorker } from "@/utils/WorkerUtils";
import { Ionicons } from "@expo/vector-icons";
import { Button, Icon, Modal, Text, TextArea, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

interface CancelRequestButtonProps {
  requestDetails: RequestDetails;
}
export default function CancelRequestButton({
  requestDetails,
}: CancelRequestButtonProps) {
  const dispatch = useDispatch();
  const [isLeadWorker, setIsLeadWorker] = useState<boolean>(false);
  const openModal = () => {
    dispatch(setRequestId(requestDetails.requestId));
    dispatch(setCancelRequestModalState(true));
  };

  useEffect(() => {
    IsLeadWorker(requestDetails).then((result) => {
      setIsLeadWorker(result);
    });
  }, []);
  return (
    <>
      {requestDetails.status === COMPLETED || isLeadWorker === false ? null : (
        <VStack space={3} w="100%">
          <Button
            style={styles.cancelButton}
            leftIcon={
              <Icon as={Ionicons} name="stop-circle-outline" size="md" />
            }
            size="sm"
            onPress={openModal}
          >
            <Text
              fontWeight="bold"
              style={styles.cancelButtonText}
              fontSize="sm"
            >
              Hủy yêu cầu
            </Text>

            <CancelRequestModal />
          </Button>
        </VStack>
      )}
    </>
  );
}

function CancelRequestModal() {
  const [isCanceling, setIsCanceling] = useState(false);
  const [conclusion, setConclusion] = useState("");
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [isTextInvalid, setIsTextInvalid] = useState(false);
  const cancelRequestModalState = useSelector(
    (state: RootState) => state.cancelRequestModal
  );
  const buildRequest = (): CancelRequest => {
    return {
      requestId: cancelRequestModalState.requestId,
      conclusion: conclusion,
    };
  };

  const handleCancelRequest = async () => {
    if (conclusion.length === 0) {
      setIsTextInvalid(true);
      return;
    } else setIsTextInvalid(false);
    setIsCanceling(true);
    try {
      const cancelRequest = buildRequest();
      console.log("cancelrequest", cancelRequest);
      await API_Requests_CancelRequest(cancelRequest);
      dispatch(setIsLoading(true));
    } catch (error) {
    } finally {
      setIsCanceling(false);
      dispatch(setCancelRequestModalState(false));
    }
  };
  return (
    <Modal
      isOpen={cancelRequestModalState.isOpen}
      onClose={() => dispatch(setCancelRequestModalState(false))}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
    >
      <Modal.Content height={SCREEN_HEIGHT * 0.35}>
        <Modal.CloseButton _icon={{ color: Colors.ewmh.foreground }} />
        <Modal.Header backgroundColor={Colors.ewmh.background}>
          <Text color={Colors.ewmh.foreground} fontWeight="bold">
            Hủy yêu cầu
          </Text>
        </Modal.Header>
        <Modal.Body>
          <View style={styles.childSections}>
            <Text fontSize="md" fontWeight="bold">
              Kết luận
            </Text>
            <TextArea
              h={20}
              autoCompleteType={true}
              placeholder="Lý do..."
              w="100%"
              value={conclusion}
              onChangeText={(text) => setConclusion(text)}
            />
            {isTextInvalid ? (
              <Text style={{ color: Colors.ewmh.danger }}>
                Bạn phải nhập lý do hủy cho yêu cầu này.
              </Text>
            ) : null}
          </View>
        </Modal.Body>
        <Modal.Footer>
          {isCanceling ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button onPress={() => handleCancelRequest()}>Chấp nhận</Button>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 15,
    width: "100%",
  },
  childSections: {
    marginVertical: 2,
  },
  cancelButton: {
    flexDirection: "row",
    backgroundColor: Colors.ewmh.danger1,
    width: "100%",
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: Colors.ewmh.foreground,
  },
});
