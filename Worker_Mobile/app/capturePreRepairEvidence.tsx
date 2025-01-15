import CustomAlertDialogV2 from "@/components/shared/CustomAlertDialogV2";
import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import {
  addPreRepairImage,
  resetPreRepairEvidence,
  setImageUri,
  setPreviewVisibility,
} from "@/redux/screens/capturePreRepairEvidenceScreenSlice";

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

export default function CapturePreRepairEvidenceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);
  const dispatch = useDispatch();
  const requestId = useSelector(
    (state: RootState) => state.capturePreRepairEvidenceScreen.requestId
  );
  const capturedImage = useSelector(
    (state: RootState) => state.capturePreRepairEvidenceScreen.imageUri
  );
  const isPreviewVisible = useSelector(
    (state: RootState) => state.capturePreRepairEvidenceScreen.isPreviewVisible
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
      dispatch(addPreRepairImage(compresedPhoto.uri));
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToHomePage = () => {
    dispatch(resetPreRepairEvidence());
    router.navigate("/(tabs)/home");
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
            alt="preRepairEvidenceImage"
          />
          {isProcessing ? (
            <ActivityIndicator
              size="large"
              color={Colors.ewmh.foreground}
              style={{
                position: "absolute",
                alignSelf: "center",
                bottom: SCREEN_HEIGHT * 0.1,
              }}
            />
          ) : (
            <VStack style={styles.postCaptureButtons} space={3}>
              <Button
                style={styles.retakeButton}
                onPress={goToHomePage}
                leftIcon={
                  <Icon as={Ionicons} name="arrow-forward-circle-outline" />
                }
              >
                <Text style={styles.text}>Tiếp tục</Text>
              </Button>
            </VStack>
          )}
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
      <CustomAlertDialogV2
        isShown={isErrorShown}
        hideModal={() => {
          setIsErrorShown(false);
        }}
        proceedText="Chấp nhận"
        header="Thông báo"
        body={error}
      />
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
