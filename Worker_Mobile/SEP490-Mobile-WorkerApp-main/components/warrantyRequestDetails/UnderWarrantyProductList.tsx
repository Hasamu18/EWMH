import { SCREEN_HEIGHT } from "@/constants/Device";
import { RequestDetails, WarrantyRequest } from "@/models/RequestDetails";
import { ScrollView, Text } from "native-base";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";
import UnderWarrantyProductCard from "./UnderWarrantyProductCard";

interface UnderWarrantyProductListProps {
  warrantyRequests: WarrantyRequest[];
  requestDetails: RequestDetails;
}
export default function UnderWarrantyProductList({
  warrantyRequests,
  requestDetails,
}: UnderWarrantyProductListProps) {
  return (
    <View style={styles.container}>
      {warrantyRequests.length === 0 ? (
        <NoProductsText />
      ) : (
        <UnderWarrantyProducts
          warrantyRequests={warrantyRequests}
          requestDetails={requestDetails}
        />
      )}
    </View>
  );
}

function NoProductsText() {
  return (
    <Text style={styles.noProductsText} fontSize="lg">
      Chưa có sản phẩm đính kèm cho yêu cầu bảo hành này.
    </Text>
  );
}

function UnderWarrantyProducts({
  warrantyRequests,
  requestDetails,
}: UnderWarrantyProductListProps) {
  return (
    <View style={styles.warrantyRequests}>
      <ScrollView h="100%" nestedScrollEnabled={true}>
        {warrantyRequests.map((request, key) => {
          return (
            <UnderWarrantyProductCard
              warrantyRequest={request}
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
  warrantyRequests: {
    marginVertical: 10,
  },
  noProductsText: {
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});
