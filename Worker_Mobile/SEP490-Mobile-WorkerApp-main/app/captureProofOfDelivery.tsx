import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import {
  resetProofOfDelivery,
  setImageUri,
  setPreviewVisibility,
} from "@/redux/screens/captureProofOfDeliveryScreenSlice";
import { RootState } from "@/redux/store";
import { CompressPhoto } from "@/utils/ImageUtils";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { CameraType, useCameraPermissions } from "expo-image-picker";
import { router } from "expo-router";
import { Button, Icon, IconButton, Image, VStack } from "native-base";
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function CaptureProofOfDeliveryScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const capturedImage = useSelector(
    (state: RootState) => state.captureProofOfDeliveryScreen.imageUri
  );
  const isPreviewVisible = useSelector(
    (state: RootState) => state.captureProofOfDeliveryScreen.isPreviewVisible
  );
  const cameraRef = useRef<any>(null);
  const handleCapture = async () => {
    try {
      if (!cameraRef) return;
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync();
      const compresedPhoto = await CompressPhoto(photo, 500, 500, 0.5);
      dispatch(setImageUri(compresedPhoto.uri));
      dispatch(setPreviewVisibility(true));
      setIsProcessing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const backToShippingOrderDetails = () => {
    router.navigate("/shippingOrderDetails");
  };
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/warning.png")}
          style={styles.warningIcon}
          alt="warning"
        />
        <Text style={styles.warning}>Lưu ý</Text>
        <Text style={styles.message}>
          Bạn cần cấp quyền sử dụng camera cho ứng dụng để tiếp tục.
        </Text>
        <Button
          style={styles.requestCameraPermissionButton}
          onPress={requestPermission}
        >
          <Text style={{ fontWeight: "bold", color: Colors.ewmh.foreground }}>
            Chấp nhận
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      {isPreviewVisible && capturedImage ? (
        <>
          <Image
            source={{ uri: capturedImage }}
            style={styles.preview}
            alt="proofOfDeliveryImage"
          />
          <VStack style={styles.postCaptureButtons} space={3}>
            <Button
              style={styles.retakeButton}
              onPress={() => dispatch(resetProofOfDelivery())}
              leftIcon={<Icon as={Ionicons} name="camera-outline" />}
            >
              <Text style={styles.text}>Chụp lại</Text>
            </Button>
            <Button
              style={styles.retakeButton}
              onPress={backToShippingOrderDetails}
              leftIcon={
                <Icon as={Ionicons} name="arrow-forward-circle-outline" />
              }
            >
              <Text style={styles.text}>Tiếp tục</Text>
            </Button>
          </VStack>
        </>
      ) : (
        <>
          <CameraView
            style={styles.camera}
            facing={CameraType.back}
            ref={cameraRef}
          >
            {isProcessing ? (
              <ActivityIndicator
                size="large"
                style={{
                  flex: 1,
                  backgroundColor: Colors.ewmh.background2,
                }}
              />
            ) : (
              <View style={styles.buttonContainer}>
                <IconButton
                  size="lg"
                  style={styles.button}
                  icon={<Icon as={Ionicons} name="camera-outline" />}
                  _icon={{ color: Colors.ewmh.foreground, size: "6xl" }}
                  color={Colors.ewmh.foreground}
                  onPress={handleCapture}
                />
              </View>
            )}
          </CameraView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
  },
  preview: {
    flex: 1,
  },
  warning: {
    fontWeight: "bold",
    fontSize: 20,
  },
  message: {
    textAlign: "center",
    marginVertical: SCREEN_HEIGHT * 0.02,
    fontSize: 18,
    width: SCREEN_WIDTH * 0.5,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  requestCameraPermissionButton: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT * 0.05,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  retakeButton: {
    backgroundColor: Colors.ewmh.background,
  },
  postCaptureButtons: {
    position: "absolute",
    alignSelf: "center",
    bottom: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.9,
  },
  warningIcon: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.15,
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
});
