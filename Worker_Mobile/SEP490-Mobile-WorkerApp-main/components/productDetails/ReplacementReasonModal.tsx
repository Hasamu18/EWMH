import { API_Requests_AddProductToRequest } from "@/api/requests";
import Colors from "@/constants/Colors";
import { NewReplacementProductRequest } from "@/models/NewReplacementProductRequest";
import store, { RootState } from "@/redux/store";
import { router } from "expo-router";
import { Button, Modal, Text, TextArea, VStack } from "native-base";
import React, { useState } from "react";

import { SUCCESS } from "@/constants/HttpCodes";
import { setReplacementReasonModalState } from "@/redux/components/replacementReasonModalSlice";

import { setIsLoading, setRequestId } from "@/redux/screens/homeScreenSlice";
import { ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";

export default function ReplacementReasonModal() {
  const dispatch = useDispatch();
  const [replacementReason, setReplacementReason] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const state: RootState = store.getState();
  const [error, setError] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [isTextInvalid, setIsTextInvalid] = useState(false);
  const isModalOpen = useSelector(
    (state: RootState) => state.replacementReasonModal.isOpen
  );

  const addReplacementProduct = () => {
    if (replacementReason.length === 0) {
      setIsTextInvalid(true);
      return;
    } else setIsTextInvalid(false);
    setIsAddingProduct(true);
    const request = prepareNewReplacementProductRequest();
    API_Requests_AddProductToRequest(request)
      .then((response) => {
        if (response.status != SUCCESS) {
          response.text().then((error) => {
            setError(error);
            setIsErrorShown(true);
          });
        } else {
          dispatch(setRequestId(state.replacementReasonModal.requestId));
          dispatch(setIsLoading(true));
          router.navigate("/(tabs)/home");
        }
      })
      .catch((error) => {
        console.log("Đã có lỗi xảy ra: ", error);
      })
      .finally(() => {
        setIsAddingProduct(false);
        closeModal();
      });
  };
  const prepareNewReplacementProductRequest =
    (): NewReplacementProductRequest => {
      return {
        requestId: state.replacementReasonModal.requestId,
        productList: [
          {
            productId: state.replacementReasonModal.productId,
            quantity: state.replacementReasonModal.quantity,
            isCustomerPaying: true,
            description: replacementReason,
          },
        ],
      };
    };
  const closeModal = () => {
    dispatch(setReplacementReasonModalState(false));
    setIsTextInvalid(false);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content>
          <Modal.CloseButton _icon={{ color: Colors.ewmh.foreground }} />
          <Modal.Header backgroundColor={Colors.ewmh.background}>
            <Text color={Colors.ewmh.foreground} fontWeight="bold">
              Thêm lý do sửa chữa
            </Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <TextArea
                h={20}
                autoCompleteType={true}
                placeholder="Nhập lý do tại đây..."
                w="100%"
                value={replacementReason}
                isInvalid={isTextInvalid}
                onChangeText={(text) => setReplacementReason(text)}
              />
              {isTextInvalid ? (
                <Text style={{ color: Colors.ewmh.danger }}>
                  Bạn phải nhập lý do thay thế.
                </Text>
              ) : null}
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            {isAddingProduct ? (
              <ActivityIndicator size="large" />
            ) : (
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={closeModal}
                >
                  Hủy
                </Button>

                <Button
                  backgroundColor={Colors.ewmh.background}
                  onPress={addReplacementProduct}
                >
                  Tiếp tục
                </Button>
              </Button.Group>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <CustomAlertDialogV2
        isShown={isErrorShown}
        hideModal={() => {
          setIsErrorShown(false);
        }}
        proceedText="Chấp nhận"
        header="Thông báo"
        body={error}
      />
    </>
  );
}
