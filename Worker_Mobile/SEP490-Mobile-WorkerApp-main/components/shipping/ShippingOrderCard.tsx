import { SCREEN_HEIGHT } from "@/constants/Device";
import { ShippingOrder } from "@/models/ShippingOrder";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Divider, HStack, Icon, Text, VStack } from "native-base";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";
import { setIsLoading } from "@/redux/screens/shippingOrderDetailsScreenSlice";
import { useDispatch } from "react-redux";

interface ShippingOrderCardProps {
  shippingOrder: ShippingOrder;
}
export default function ShippingOrderCard({
  shippingOrder,
}: ShippingOrderCardProps) {
  const dispatch = useDispatch();
  const goToDetails = () => {
    dispatch(setIsLoading(true));
    router.push({
      pathname: "/shippingOrderDetails",
      params: { shippingId: shippingOrder.shippingOrder.shippingId },
    });
  };
  return (
    <View style={styles.container}>
      <VStack w="100%" space={1}>
        <HStack style={styles.informationView}>
          <Text
            fontWeight="bold"
            fontSize="md"
            style={styles.id}
            noOfLines={2}
            w="100%"
          >
            {shippingOrder.shippingOrder.shippingId}
          </Text>
        </HStack>
        <View style={styles.informationView}>
          <Text fontSize="md">Khách hàng: </Text>
          <Text fontWeight="bold" fontSize="md">
            {shippingOrder.cusInfo.fullName}
          </Text>
        </View>
        <View style={styles.informationView}>
          <Text fontSize="md">Số điện thoại: </Text>
          <Text fontWeight="bold" fontSize="md">
            {shippingOrder.cusInfo.phoneNumber}
          </Text>
        </View>
        <Button
          style={styles.showDetailsButton}
          leftIcon={<Icon as={Ionicons} name="add-circle-outline" />}
          size="sm"
          onPress={goToDetails}
        >
          <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
            Xem chi tiết
          </Text>
        </Button>
        <Divider style={styles.divider} />
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  divider: {
    marginVertical: 2,
    color: Colors.ewmh.background,
  },
  informationView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  id: {
    color: Colors.ewmh.background,
  },
  showDetailsButton: {
    flexDirection: "row",
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  orderButtonText: {
    color: Colors.ewmh.foreground,
  },
});
