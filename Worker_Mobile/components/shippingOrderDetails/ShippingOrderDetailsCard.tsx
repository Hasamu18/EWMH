import { FormatPriceToVnd } from "@/utils/PriceUtils";
import { Ionicons } from "@expo/vector-icons";
import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "native-base";
import { StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { ShippingOrderDetails_OrderItem } from "@/models/ShippingOrderDetails";
import {
  setShippingOrderDetailsModalState,
  setShippingOrderItem,
} from "@/redux/components/shippingOrderDetailsModalSlice";
import { useDispatch } from "react-redux";

export interface ShippingOrderDetailsCardProps {
  shippingOrderItem: ShippingOrderDetails_OrderItem;
}
export default function ShippingOrderDetailsCard({
  shippingOrderItem,
}: ShippingOrderDetailsCardProps) {
  const dispatch = useDispatch();
  const openShippingOrderModal = () => {
    dispatch(setShippingOrderItem(shippingOrderItem));
    dispatch(setShippingOrderDetailsModalState(true));
  };
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
            uri: shippingOrderItem.product.imageUrl,
          }}
          w="100%"
          h="100%"
          alt="image"
        />
      </Box>

      <VStack space={3} style={styles.productDetails}>
        <Text fontSize="md" fontWeight="bold">
          {shippingOrderItem.product.name}
        </Text>
        <Text fontSize="md" fontWeight="bold" color={Colors.ewmh.background}>
          Tổng tiền:{" "}
          {FormatPriceToVnd(shippingOrderItem.orderDetail.totalPrice)}
        </Text>
        <Badge colorScheme="info" variant="outline" style={styles.badge}>
          <Text fontWeight="bold">
            Số lượng mua mới: {shippingOrderItem.orderDetail.quantity}
          </Text>
        </Badge>
        <Button
          style={styles.showDetailsButton}
          leftIcon={<Icon as={Ionicons} name="add-circle-outline" />}
          size="sm"
          onPress={openShippingOrderModal}
        >
          <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
            Xem chi tiết
          </Text>
        </Button>
      </VStack>
    </HStack>
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
  menuButton: {
    flex: 1,
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
