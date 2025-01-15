import Colors from "@/constants/Colors";
import { ShippingOrderDetails_WarrantyCard } from "@/models/ShippingOrderDetails";
import {
  ConvertToOtherDateStringFormat,
  DateToStringModes,
} from "@/utils/DateUtils";

import { Text, VStack } from "native-base";
import { StyleSheet, View } from "react-native";

interface SodWarrantyCardProps {
  warrantyCard: ShippingOrderDetails_WarrantyCard;
}
export default function SodWarrantyCard({
  warrantyCard,
}: SodWarrantyCardProps) {
  return (
    <View style={styles.container}>
      <VStack space={2} style={styles.productDetails}>
        <View style={styles.description}>
          <Text fontSize="md" fontWeight="bold" noOfLines={2}>
            Mã thẻ:
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            noOfLines={2}
            textAlign="right"
            w="50%"
          >
            {warrantyCard.warrantyCardId}
          </Text>
        </View>
        <View style={styles.description}>
          <Text fontSize="md" fontWeight="bold" noOfLines={2}>
            Ngày bắt đầu:
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            noOfLines={2}
            color={Colors.ewmh.background}
          >
            {ConvertToOtherDateStringFormat(
              warrantyCard.startDate,
              DateToStringModes.DMY
            )}
          </Text>
        </View>
        <View style={styles.description}>
          <Text fontSize="md" fontWeight="bold" noOfLines={2}>
            Ngày kết thúc:
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            noOfLines={2}
            color={Colors.ewmh.danger}
          >
            {ConvertToOtherDateStringFormat(
              warrantyCard.expireDate,
              DateToStringModes.DMY
            )}
          </Text>
        </View>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ewmh.background2,
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
  },
  activityIndicator: {
    alignSelf: "center",
    marginVertical: 10,
  },
  productDetails: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10,
  },
  price: {
    color: Colors.ewmh.background,
  },
  description: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  removeButton: {
    width: "100%",
    marginVertical: 5,
  },
});
