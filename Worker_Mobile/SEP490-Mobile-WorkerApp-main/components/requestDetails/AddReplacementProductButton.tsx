import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { setRequestId } from "@/redux/components/replacementReasonModalSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Icon, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

interface AddReplacementProductButtonProps {
  requestId: string;
}
export default function AddReplacementProductButton({
  requestId,
}: AddReplacementProductButtonProps) {
  const dispatch = useDispatch();
  const goToProductList = () => {
    dispatch(setRequestId(requestId));
    router.push("/products");
  };
  return (
    <VStack space={3}>
      <Button
        style={styles.addProduct}
        leftIcon={<Icon as={Ionicons} name="add-circle-outline" />}
        size="sm"
        onPress={goToProductList}
      >
        <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
          Thêm sản phẩm
        </Text>
      </Button>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 15,
  },

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
