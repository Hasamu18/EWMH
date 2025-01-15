import { API_Requests_DeleteReplacementProduct } from "@/api/requests";
import Colors from "@/constants/Colors";
import { COMPLETED } from "@/constants/Request";
import { ReplacementProduct, RequestDetails } from "@/models/RequestDetails";
import {
  setEditReplacementProduct,
  setEditReplacementReasonModalState,
} from "@/redux/components/editReplacementReasonModalSlice";

import { SUCCESS } from "@/constants/HttpCodes";
import { setIsLoading, setRequestId } from "@/redux/screens/homeScreenSlice";
import { IsLeadWorker } from "@/utils/WorkerUtils";
import { Ionicons } from "@expo/vector-icons";
import {
  Badge,
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { FormatPriceToVnd } from "../../utils/PriceUtils";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";

export interface OrderCardProps {
  product: ReplacementProduct;
  requestDetails: RequestDetails;
}
export default function OrderCard({ product, requestDetails }: OrderCardProps) {
  return (
    <HStack
      style={styles.container}
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
    >
      <Box style={styles.productImage}>
        <Image
          source={{
            uri: product.imageUrl,
          }}
          w="100%"
          h="100%"
          alt="image"
        />
      </Box>

      <VStack space={3} style={styles.productDetails}>
        <Text fontSize="md" fontWeight="bold">
          {product.productName}
        </Text>
        <Text fontSize="md" fontWeight="bold" color={Colors.ewmh.background}>
          {FormatPriceToVnd(product.productPrice)}
        </Text>
        <Badge colorScheme="info" variant="outline" style={styles.badge}>
          <Text fontWeight="bold">Số lượng mua mới: {product.quantity}</Text>
        </Badge>
        <Text fontSize="md" fontWeight="bold">
          Lý do: {product.replacementReason}
        </Text>
      </VStack>
      <MenuItems product={product} requestDetails={requestDetails} />
    </HStack>
  );
}
function MenuItems({ product, requestDetails }: OrderCardProps) {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeadWorker, setIsLeadWorker] = useState(false);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [error, setError] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);
  const toggleEditReplacementReason = () => {
    dispatch(setEditReplacementProduct(product));
    dispatch(setEditReplacementReasonModalState(true));
  };
  const deleteReplacementProduct = () => {
    setIsDeleting(true);
    API_Requests_DeleteReplacementProduct(product.requestDetailId).then(
      (response) => {
        if (response.status != SUCCESS) {
          response.text().then((error) => {
            setError(error);
            setIsErrorShown(true);
          });
        } else {
          dispatch(setRequestId(requestDetails.requestId));
          console.log("Đã xóa sản phẩm thành công");
          setIsDeleting(false);
          dispatch(setIsLoading(true));
        }
      }
    );
  };
  useEffect(() => {
    IsLeadWorker(requestDetails).then((result) => {
      setIsLeadWorker(result);
    });
  }, []);
  return (
    <Box style={styles.menuButtonGroup}>
      {!isLeadWorker || requestDetails.status === COMPLETED ? null : (
        <>
          <VStack h="100%">
            <IconButton
              size="lg"
              style={{
                flex: 5,
                backgroundColor: Colors.ewmh.background,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
              icon={<Icon as={Ionicons} name="create-outline" />}
              _icon={{ color: Colors.ewmh.foreground, size: "xl" }}
              color={Colors.ewmh.background}
              onPress={toggleEditReplacementReason}
            />
            <IconButton
              size="lg"
              style={{
                flex: 5,
                backgroundColor: Colors.ewmh.danger1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              icon={<Icon as={Ionicons} name="trash-outline" />}
              _icon={{ color: Colors.ewmh.foreground, size: "xl" }}
              color={Colors.ewmh.foreground}
              onPress={() => setIsDeleteModalShown(true)}
            />
          </VStack>

          <CustomAlertDialogV2
            isShown={isDeleteModalShown}
            isActionExecuting={isDeleting}
            hideModal={() => setIsDeleteModalShown(false)}
            header="Cảnh báo"
            body="Bạn có chắc chắn muốn xóa sản phẩm này?"
            proceedText="Có"
            cancelText="Không"
            action={deleteReplacementProduct}
          />
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
    </Box>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    flex: 1,
    backgroundColor: Colors.ewmh.background3,
  },
  productDetails: {
    flexDirection: "column",
    padding: 10,
    flex: 6,
  },
  productImage: {
    width: 20,
    flex: 3,
  },
  menuButtonGroup: {
    flex: 2,
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
