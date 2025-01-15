import { SCREEN_HEIGHT } from "@/constants/Device";
import {
  setChoosePaymentMethodModalState,
  setConclusion,
  setIsTextInvalid,
  setPaymentMethod,
} from "@/redux/components/choosePaymentMethodModalSlice";
import { RootState } from "@/redux/store";
import { Button, Modal, Radio, Text, TextArea, View } from "native-base";
import React, { useEffect, useState } from "react";

import { API_Requests_CompleteRequest } from "@/api/requests";
import Colors from "@/constants/Colors";
import { OFFLINE_PAYMENT, PAYMENT_METHODS } from "@/constants/PaymentMethods";
import { CompleteRequest } from "@/models/CompleteRequest";
import { RequestDetails } from "@/models/RequestDetails";
import { setIsLoading } from "@/redux/screens/homeScreenSlice";
import { setRequestId } from "@/redux/screens/postCheckoutScreenSlice";
import { router } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface ChoosePaymentMethodProps {
  requestDetails: RequestDetails;
}
export default function ChoosePaymentMethod({
  requestDetails,
}: ChoosePaymentMethodProps) {
  const [isCompletingRequest, setIsCompletingRequest] = useState(false);
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const choosePaymentMethodModal = useSelector(
    (state: RootState) => state.choosePaymentMethodModal
  );
  const conclusion = useSelector(
    (state: RootState) => state.choosePaymentMethodModal.conclusion
  );
  const areReplacementProductsFound =
    requestDetails.replacementProducts?.length != 0;
  const shouldCustomerPay =
    areReplacementProductsFound ||
    requestDetails.contractId === undefined ||
    requestDetails.contractId === null;

  const handleOfflinePayment = () => {
    setIsCompletingRequest(true);
    const completeRequest: CompleteRequest = {
      requestId: choosePaymentMethodModal.requestId,
      conclusion: choosePaymentMethodModal.conclusion,
      orderCode: null!,
    };
    API_Requests_CompleteRequest(completeRequest).then(() => {
      setIsCompletingRequest(false);
      dispatch(setChoosePaymentMethodModalState(false));
      dispatch(setIsLoading(true));
    });
  };
  const handleOnlinePayment = () => {
    const requestId = choosePaymentMethodModal.requestId;
    /*
      This helps postCheckout screen finish the online payment, 
      if it's not canceled.
    */
    dispatch(setRequestId(requestId));
    dispatch(setChoosePaymentMethodModalState(false));
    router.push({
      pathname: "/checkout",
      params: {
        requestId: requestId,
        conclusion: choosePaymentMethodModal.conclusion,
      },
    });
  };
  const handlePayment = () => {
    if (conclusion.length === 0) {
      dispatch(setIsTextInvalid(true));
      return;
    } else dispatch(setIsTextInvalid(false));
    if (choosePaymentMethodModal.paymentMethod == OFFLINE_PAYMENT)
      handleOfflinePayment();
    else handleOnlinePayment();
  };

  const cleanup = () => {
    //Resets the state of choosePaymentMethod Modal.
    dispatch(setChoosePaymentMethodModalState(false));
    dispatch(setPaymentMethod(OFFLINE_PAYMENT));
    dispatch(setIsTextInvalid(false));
    dispatch(setConclusion(""));
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);
  return (
    <Modal
      isOpen={choosePaymentMethodModal.isOpen}
      onClose={cleanup}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
    >
      <Modal.Content
        height={shouldCustomerPay ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.34}
      >
        <Modal.CloseButton _icon={{ color: Colors.ewmh.foreground }} />
        <Modal.Header backgroundColor={Colors.ewmh.background}>
          <Text color={Colors.ewmh.foreground} fontWeight="bold">
            Hoàn thành yêu cầu
          </Text>
        </Modal.Header>
        <Modal.Body>
          <EnterConclusionSection />
          {shouldCustomerPay && <ChoosePaymentRadioButton />}
        </Modal.Body>
        <Modal.Footer>
          {isCompletingRequest ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button onPress={handlePayment}>Hoàn thành</Button>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
function EnterConclusionSection() {
  const dispatch = useDispatch();
  const conclusion = useSelector(
    (state: RootState) => state.choosePaymentMethodModal.conclusion
  );
  const isTextInvalid = useSelector(
    (state: RootState) => state.choosePaymentMethodModal.isTextInvalid
  );
  return (
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
        onChangeText={(text) => dispatch(setConclusion(text))}
        isInvalid={isTextInvalid}
      />
      {isTextInvalid ? (
        <Text style={{ color: Colors.ewmh.danger }}>
          Bạn phải nhập kết luận cho yêu cầu sửa chữa.
        </Text>
      ) : null}
    </View>
  );
}

function ChoosePaymentRadioButton() {
  const dispatch = useDispatch();
  const paymentMethod = useSelector(
    (state: RootState) => state.choosePaymentMethodModal.paymentMethod
  );
  return (
    <View style={styles.childSections}>
      <Text fontSize="md" fontWeight="bold">
        Hình thức thanh toán
      </Text>
      <Radio.Group
        name="myRadioGroup"
        value={paymentMethod}
        onChange={(value) => {
          dispatch(setPaymentMethod(value));
        }}
      >
        {PAYMENT_METHODS.map((method, key) => {
          return (
            <Radio value={method.value} my="1" key={key}>
              {method.text}
            </Radio>
          );
        })}
      </Radio.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  childSections: {
    marginVertical: 10,
  },
});
