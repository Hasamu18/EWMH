import { Spinner } from "native-base";
import { StyleSheet, View } from "react-native";

export default function FullScreenSpinner() {
  return (
    <View style={styles.container}>
      <Spinner size="2xl" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
