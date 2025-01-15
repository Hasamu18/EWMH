import Colors from "@/constants/Colors";
import { addAcceptanceReportImage } from "@/redux/screens/capturePostRepairEvidenceScreenSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Icon, Image, Text, View } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import { useDispatch } from "react-redux";
export default function DocumentScannerScreen() {
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  const scanDocument = async () => {
    try {
      // Start the document scanner
      const { scannedImages } = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });

      // Check if scanning was successful
      if (scannedImages && scannedImages.length > 0) {
        setScannedImage(scannedImages[0]); // Set the first scanned image
        setError(null); // Clear any previous errors
        dispatch(addAcceptanceReportImage(scannedImages[0]));
      } else {
        setError("Chưa có hình nào được quét");
      }
    } catch (e) {
      setError("Đã có lỗi xảy ra. Xin vui lòng thử lại sau");
    }
  };

  const goBackToHomeScreen = () => {
    router.navigate("/(tabs)/home");
  };
  useEffect(() => {
    scanDocument();
  }, []);
  return (
    <View style={styles.container}>
      {/* Display scanned image or error message */}
      {scannedImage && (
        <Image
          resizeMode="contain"
          style={styles.image}
          source={{ uri: scannedImage }}
          alt="Scanned Document"
        />
      )}

      {scannedImage && (
        <Button
          style={styles.button}
          leftIcon={
            <Icon as={Ionicons} name="arrow-forward-circle" size="md" />
          }
          onPress={goBackToHomeScreen}
        >
          <Text color={Colors.ewmh.foreground} fontWeight="bold">
            Tiếp tục
          </Text>
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "80%",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.ewmh.background,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
