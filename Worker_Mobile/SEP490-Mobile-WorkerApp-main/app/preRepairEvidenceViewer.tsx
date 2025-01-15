import { API_Requests_AddPreRepairEvidence } from "@/api/requests";
import CustomAlertDialogV2 from "@/components/shared/CustomAlertDialogV2";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { SUCCESS } from "@/constants/HttpCodes";
import {
  cleanupAfterSubmission,
  setRecapture,
} from "@/redux/screens/capturePreRepairEvidenceScreenSlice";
import { setRequestId } from "@/redux/screens/homeScreenSlice";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Icon, Text } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Pdf, { Source } from "react-native-pdf";
import { useDispatch } from "react-redux";

export default function PreRepairEvidenceViewerScreen() {
  const { viewPdfUrl, submitPdfUrl, requestId } = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [source, setSource] = useState<Source>();
  const dispatch = useDispatch();

  const createSourceForViewMode = () => {
    //VIEW MODE: minor URL parse error fix
    const parsedPdfUrl = (viewPdfUrl as string).replace(
      "RequestDetails/",
      "RequestDetails%2F"
    );
    setSource({
      uri: parsedPdfUrl,
      cache: false,
    });
  };

  const createSourceForSubmitMode = () => {
    setSource({
      uri: submitPdfUrl as string,
      cache: false,
    });
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    API_Requests_AddPreRepairEvidence(
      requestId as string,
      submitPdfUrl as string
    )
      .then((response) => {
        if (response.status !== SUCCESS) {
          response.text().then((error) => {
            setError(error);
            setIsErrorShown(true);
          });
        } else {
          dispatch(setRequestId(requestId as string));
          dispatch(cleanupAfterSubmission());
          dispatch(setRecapture(false));
          router.navigate({
            pathname: "/(tabs)/home",
          });
        }
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  useEffect(() => {
    if (typeof viewPdfUrl === "string" && viewPdfUrl) {
      createSourceForViewMode();
    } else {
      createSourceForSubmitMode();
    }
  }, []);

  return (
    <View style={styles.container}>
      {!source ? (
        <FullScreenSpinner />
      ) : (
        <>
          <Pdf
            source={source}
            key={source.uri}
            style={styles.pdf}
            trustAllCerts={false}
          />
          {requestId && submitPdfUrl && (
            <View style={styles.submitButtonArea}>
              {isProcessing ? (
                <ActivityIndicator size="large" />
              ) : (
                <Button
                  style={styles.button}
                  leftIcon={
                    <Icon as={Ionicons} name="cloud-upload-sharp" size="md" />
                  }
                  onPress={handleSubmit}
                >
                  <Text color={Colors.ewmh.foreground} fontWeight="bold">
                    Đăng lên hệ thống
                  </Text>
                </Button>
              )}
            </View>
          )}
        </>
      )}
      <CustomAlertDialogV2
        header="Chú ý"
        body={error}
        isShown={isErrorShown}
        hideModal={() => setIsErrorShown(false)}
        proceedText="Chấp nhận"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
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
  },
  submitButtonArea: {
    position: "absolute",
    width: "90%",
    bottom: SCREEN_HEIGHT * 0.01,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
