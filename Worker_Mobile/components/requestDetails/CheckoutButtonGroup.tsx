import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { Button, Text, VStack } from "native-base";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import {
  UnderWarrantyProductRef,
  UnderWarrantyProducts,
} from "./UnderWarrantyProducts";

export default function CheckoutButtonGroup() {
  const goToCheckoutScreen = () => {};
  const warrantyProductRef = useRef<UnderWarrantyProductRef>(null);
  const showModal = () => {
    warrantyProductRef.current?.showModal();
  };
  return (
    <VStack>
      <Button style={styles.orderButtons} onPress={showModal}>
        <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
          Xem các sản phẩm còn bảo hành
        </Text>
      </Button>
      <UnderWarrantyProducts ref={warrantyProductRef} />
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
  divider: {
    marginVertical: 10,
  },
  requestDetail: {
    height: "50%",
    marginTop: 2,
    flexDirection: "column",
  },
  checkoutButton: {
    flexDirection: "row",
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.05,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  orderButtons: {
    flexDirection: "row",
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  orderButtonText: {
    color: Colors.ewmh.foreground,
  },
  informationView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center",
  },
  detailBlock: {
    width: "100%",
    marginTop: 8,
    flexDirection: "column",
  },
});
