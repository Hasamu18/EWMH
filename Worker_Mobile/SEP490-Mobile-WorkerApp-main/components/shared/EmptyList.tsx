import { Image, Text, View } from "native-base";
import { StyleSheet } from "react-native";
export default function EmptyList() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/out-of-stock.png")}
        size="xl"
        marginY="8"
        alt="paymentSuccess"
      />
      <Text fontWeight="bold" fontSize="2xl">
        Danh sách trống
      </Text>
      <Text fontSize="lg" textAlign="center" width="100%">
        Xin hãy thử lại sau.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
});
