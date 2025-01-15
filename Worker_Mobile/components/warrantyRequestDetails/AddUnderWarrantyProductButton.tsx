import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { setRequestId as setAddToWarrantyRequestButtonRequestId } from "@/redux/components/addToWarrantyRequestButtonSlice";
import {
  setCustomerId,
  setRequestId as setWarrantySearchRequestId,
} from "@/redux/components/warrantySearchSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Icon, Text } from "native-base";
import { StyleSheet } from "react-native";

import { useDispatch } from "react-redux";

interface AddUnderWarrantyProductButtonProps {
  requestId: string;
  customerId: string;
}
export default function AddUnderWarrantyProductButton({
  requestId,
  customerId,
}: AddUnderWarrantyProductButtonProps) {
  const dispatch = useDispatch();
  const goToWarrantyCardList = () => {
    dispatch(setWarrantySearchRequestId(requestId));
    dispatch(setAddToWarrantyRequestButtonRequestId(requestId));
    dispatch(setCustomerId(customerId));
    router.push("/warrantyCards");
  };
  return (
    <Button
      style={styles.addProduct}
      leftIcon={<Icon as={Ionicons} name="add-circle-outline" />}
      size="sm"
      onPress={goToWarrantyCardList}
    >
      <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
        Thêm sản phẩm
      </Text>
    </Button>
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
});
