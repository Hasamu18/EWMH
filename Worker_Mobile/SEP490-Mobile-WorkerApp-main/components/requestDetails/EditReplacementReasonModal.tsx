import { API_Requests_UpdateReplacementProduct } from "@/api/requests";
import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { ReplacementProduct } from "@/models/RequestDetails";
import { UpdateReplacementProductRequest } from "@/models/UpdateReplacementProductRequest";
import {
  setEditReplacementProductQuantity,
  setEditReplacementProductReplacementReason,
  setEditReplacementReasonModalState,
  setIsTextInvalid,
} from "@/redux/components/editReplacementReasonModalSlice";

import { SUCCESS } from "@/constants/HttpCodes";
import { setIsLoading, setRequestId } from "@/redux/screens/homeScreenSlice";
import { RootState } from "@/redux/store";
import { FormatPriceToVnd } from "@/utils/PriceUtils";
import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  Text,
  TextArea,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import InputSpinner from "react-native-input-spinner";
import { useDispatch, useSelector } from "react-redux";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";
import FullScreenSpinner from "../shared/FullScreenSpinner";

export default function EditReplacementReasonModal() {
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);
  const isLoading = useSelector(
    (state: RootState) => state.requestDetailsScreen.isLoading
  );
  const replacementProduct = useSelector(
    (state: RootState) => state.editReplacementReasonModal.replacementProduct
  );
  const isModalOpen = useSelector(
    (state: RootState) => state.editReplacementReasonModal.isOpen
  );

  const closeModal = () => {
    dispatch(setEditReplacementReasonModalState(false));
    dispatch(setIsTextInvalid(false));
    dispatch(setEditReplacementProductReplacementReason(""));
  };
  const updateDetails = () => {
    if (replacementProduct.replacementReason.length === 0) {
      dispatch(setIsTextInvalid(true));
      return;
    } else dispatch(setIsTextInvalid(false));

    setIsUpdating(true);
    const request = prepareNewReplacementProductRequest();
    API_Requests_UpdateReplacementProduct(request)
      .then((response) => {
        if (response.status !== SUCCESS) {
          response.text().then((error) => {
            setError(error);
            setIsErrorShown(true);
          });
        } else {
          dispatch(setRequestId(replacementProduct.requestId));
          dispatch(setIsLoading(true)); //forces the Home screen to reload
        }
      })
      .catch((error) => {
        console.log("Đã có lỗi xảy ra: ", error);
      })
      .finally(() => {
        closeModal();
        setIsUpdating(false);
      });
  };
  const prepareNewReplacementProductRequest =
    (): UpdateReplacementProductRequest => {
      return {
        product: {
          requestDetailId: replacementProduct.requestDetailId,
          quantity: replacementProduct.quantity,
          isCustomerPaying: replacementProduct.isCustomerPaying,
          description: replacementProduct.replacementReason,
        },
      };
    };
  return (
    <>
      {isLoading ? (
        <FullScreenSpinner />
      ) : (
        <>
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
          >
            <Modal.Content height={SCREEN_HEIGHT * 0.55}>
              <Modal.CloseButton _icon={{ color: Colors.ewmh.foreground }} />
              <Modal.Header backgroundColor={Colors.ewmh.background}>
                <Text color={Colors.ewmh.foreground} fontWeight="bold">
                  Sửa đơn hàng đính kèm
                </Text>
              </Modal.Header>
              <Modal.Body>
                <ReplacementReasonBody
                  replacementProduct={replacementProduct}
                />
              </Modal.Body>
              <Modal.Footer>
                {isUpdating ? (
                  <ActivityIndicator size="large" />
                ) : (
                  <Button onPress={updateDetails}>Cập nhật</Button>
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
      )}
    </>
  );
}

interface ReplacementReasonBodyProps {
  replacementProduct: ReplacementProduct;
}
function ReplacementReasonBody({
  replacementProduct,
}: ReplacementReasonBodyProps) {
  return (
    <VStack h="100%">
      <ProductSection replacementProduct={replacementProduct} />
      <AdditionalDetailsSection replacementProduct={replacementProduct} />
    </VStack>
  );
}

function ProductSection({ replacementProduct }: ReplacementReasonBodyProps) {
  const dispatch = useDispatch();
  const quantity = useSelector(
    (state: RootState) =>
      state.editReplacementReasonModal.replacementProduct.quantity
  );
  return (
    <View>
      <HStack>
        <Box style={styles.productImage}>
          <Image
            source={{
              uri: replacementProduct.imageUrl,
            }}
            w="100%"
            h="100%"
            alt="image"
          />
        </Box>

        <VStack space={3} style={styles.productDetails}>
          <Text fontSize="md" fontWeight="bold">
            {replacementProduct.productName}
          </Text>
          <Text fontSize="md" fontWeight="bold" color={Colors.ewmh.background}>
            {FormatPriceToVnd(replacementProduct.productPrice)}
          </Text>
          <InputSpinner
            max={10}
            min={1}
            step={1}
            colorMax={Colors.ewmh.danger}
            color={Colors.ewmh.background}
            value={quantity}
            width={150}
            height={50}
            fontSize={20}
            onChange={(num) =>
              dispatch(setEditReplacementProductQuantity(num as number))
            }
          />
        </VStack>
      </HStack>
    </View>
  );
}
function AdditionalDetailsSection({}: ReplacementReasonBodyProps) {
  const dispatch = useDispatch();
  const replacementProduct = useSelector(
    (state: RootState) => state.editReplacementReasonModal.replacementProduct
  );
  const isTextInvalid = useSelector(
    (state: RootState) => state.editReplacementReasonModal.isTextInvalid
  );

  return (
    <VStack style={styles.additionalDetails} space={3}>
      <Text fontSize="md" fontWeight="bold" underline>
        Lý do thay thế
      </Text>
      <TextArea
        h={20}
        autoCompleteType={true}
        placeholder="Nhập lý do tại đây..."
        w="100%"
        value={replacementProduct.replacementReason}
        onChangeText={(text) =>
          dispatch(setEditReplacementProductReplacementReason(text))
        }
        isInvalid={isTextInvalid}
      />
      {isTextInvalid ? (
        <Text style={{ color: Colors.ewmh.danger }}>
          Bạn phải nhập lý do thay thế cho món hàng này.
        </Text>
      ) : null}
    </VStack>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  productSection: {
    flex: 5,
  },
  productImage: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.2,
  },
  productDetails: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 10,
    flex: 2,
  },
  additionalDetails: {
    flex: 5,
    marginVertical: 10,
  },
});
