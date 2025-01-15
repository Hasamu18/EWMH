import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { ReplacementProduct, RequestDetails } from "@/models/RequestDetails";
import { ScrollView, Text } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";
import EditReplacementReasonModal from "./EditReplacementReasonModal";
import OrderCard from "./OrderCard";

interface OrderListProps {
  replacementProducts: ReplacementProduct[];
  requestDetails: RequestDetails;
}
export default function OrderList({
  replacementProducts,
  requestDetails,
}: OrderListProps) {
  return (
    <View style={styles.container}>
      {replacementProducts.length === 0 ? (
        <NoProductsText />
      ) : (
        <Orders
          replacementProducts={replacementProducts}
          requestDetails={requestDetails}
        />
      )}
      <EditReplacementReasonModal />
    </View>
  );
}

function NoProductsText() {
  return (
    <Text style={styles.noProductsText} fontSize="lg">
      Chưa có sản phẩm đính kèm cho yêu cầu sửa chữa này.
    </Text>
  );
}
// function BriefDetails() {
//   const [totalPrice, setTotalPrice] = useState<number>(0);
//   const getProductCount = () => {
//     return PRODUCTS.length;
//   };

//   return (
//     <View style={styles.briefDetails}>
//       <Badge colorScheme="info" variant="outline">
//         <Text fontSize="lg">{getProductCount()} sản phẩm</Text>
//       </Badge>
//       <Text fontSize="lg" fontWeight="bold" color={Colors.ewmh.background}>
//         {FormatPriceToVnd(totalPrice)}
//       </Text>
//     </View>
//   );
// }

function Orders({ replacementProducts, requestDetails }: OrderListProps) {
  return (
    <View style={styles.replacementProducts}>
      <ScrollView h="100%" nestedScrollEnabled={true}>
        {replacementProducts.map((product, key) => {
          return (
            <OrderCard
              product={product}
              requestDetails={requestDetails}
              key={key}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.48,
    marginVertical: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    borderRadius: 10,
    padding: 15,
    backgroundColor: Colors.ewmh.background2,
    overflow: "hidden",
  },
  briefDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  replacementProducts: {
    marginVertical: 10,
  },
  noProductsText: {
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});
