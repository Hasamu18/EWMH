import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { GetPreRepairHtml } from "@/constants/RepairEvidence";
import { RequestDetails } from "@/models/RequestDetails";

import {
  removePreRepairImageByIndex,
  setRecapture,
  setRequestId,
} from "@/redux/screens/capturePreRepairEvidenceScreenSlice";
import { RootState } from "@/redux/store";
import { ImagePathToBase64 } from "@/utils/ImageUtils";
import { Ionicons } from "@expo/vector-icons";
import { printToFileAsync } from "expo-print";
import { router } from "expo-router";
import { Button, HStack, Icon, Text, VStack } from "native-base";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";
import MultipleImageTaker from "./MultipleImageTaker";

interface PreRepairEvidenceViewerProps {
  requestDetails: RequestDetails;
}

export default function PreRepairEvidenceViewer({
  requestDetails,
}: PreRepairEvidenceViewerProps) {
  const isRecapture = useSelector(
    (state: RootState) => state.capturePreRepairEvidenceScreen.isRecapture
  );
  return (
    <>
      {!requestDetails.preRepairEvidenceUrl || isRecapture ? (
        <CapturePreRepairEvidence requestDetails={requestDetails} />
      ) : (
        <ViewPreRepairEvidence requestDetails={requestDetails} />
      )}
    </>
  );
}

interface ViewPreRepairEvidenceProps {
  requestDetails: RequestDetails;
}
function ViewPreRepairEvidence({ requestDetails }: ViewPreRepairEvidenceProps) {
  const dispatch = useDispatch();
  const [isWarningShown, setIsWarningShown] = useState(false);
  const goToViewEvidenceScreen = () => {
    dispatch(setRequestId(requestDetails.requestId));
    router.push({
      pathname: "/preRepairEvidenceViewer",
      params: {
        viewPdfUrl: requestDetails.preRepairEvidenceUrl,
      },
    });
  };
  return (
    <HStack>
      <Button
        style={styles.viewEvidenceButton}
        leftIcon={<Icon as={Ionicons} name="eye-sharp" />}
        onPress={goToViewEvidenceScreen}
      >
        <Text color={Colors.ewmh.foreground} fontWeight="bold">
          Xem
        </Text>
      </Button>
      <Button
        style={styles.recaptureButton}
        leftIcon={<Icon as={Ionicons} name="camera-outline" />}
        onPress={() => setIsWarningShown(true)}
      >
        <Text color={Colors.ewmh.foreground} fontWeight="bold">
          Chụp lại
        </Text>
      </Button>
      <CustomAlertDialogV2
        isShown={isWarningShown}
        hideModal={() => {
          setIsWarningShown(false);
        }}
        proceedText="Chấp nhận"
        cancelText="Từ chối"
        header="Thông báo"
        body="Bạn có chắc chắn muốn chụp lại hình trước khi sửa chữa?"
        action={() => dispatch(setRecapture(true))}
      />
    </HStack>
  );
}

function CapturePreRepairEvidence({
  requestDetails,
}: PreRepairEvidenceViewerProps) {
  const dispatch = useDispatch();
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const preRepairImages = useSelector(
    (state: RootState) => state.capturePreRepairEvidenceScreen.preRepairImages
  );
  const removeImage = (index: number) => {
    dispatch(removePreRepairImageByIndex(index));
  };
  const areImagesValid = (): boolean => {
    if (preRepairImages.length === 0) {
      setError("Bạn phải chụp ít nhất 1 tấm hình trước sửa chữa.");
      setIsErrorShown(true);
      return false;
    }
    return true;
  };

  const generatePreRepairPdf = async () => {
    if (!areImagesValid()) return;
    setIsProcessing(true);
    const b64Images = await Promise.all(
      preRepairImages.map((ar) => ImagePathToBase64(ar))
    );
    const html = GetPreRepairHtml(b64Images);
    const pdf = await printToFileAsync({ html: html, base64: false });
    setIsProcessing(false);
    router.push({
      pathname: "/preRepairEvidenceViewer",
      params: { submitPdfUrl: pdf.uri, requestId: requestDetails.requestId },
    });
  };

  return (
    <VStack style={styles.preRepairEvidenceContainer}>
      <MultipleImageTaker
        route={"/capturePreRepairEvidence"}
        images={preRepairImages}
        removeImage={removeImage}
        maxCount={10}
      />
      {isProcessing ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          style={styles.continueToPdfButton}
          leftIcon={
            <Icon as={Ionicons} name="arrow-forward-circle" size="md" />
          }
          onPress={generatePreRepairPdf}
        >
          <Text color={Colors.ewmh.foreground} fontWeight="bold">
            Tiếp tục
          </Text>
        </Button>
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
    </VStack>
  );
}

const styles = StyleSheet.create({
  detailBlock: {
    width: "100%",
    marginTop: 8,
    flexDirection: "column",
  },
  preRepairEvidence: {
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.5,
  },
  recaptureButton: {
    backgroundColor: Colors.ewmh.recapture,
    flex: 5,
  },
  preRepairEvidenceContainer: {
    height: SCREEN_HEIGHT * 0.3,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.ewmh.background2,
    overflow: "hidden",
  },
  findOutMoreButton: {
    backgroundColor: Colors.ewmh.recapture,
    width: "100%",
  },
  continueToPdfButton: {
    backgroundColor: Colors.ewmh.background,
    width: "100%",
  },
  viewEvidenceButton: {
    backgroundColor: Colors.ewmh.background,
    flex: 5,
    marginRight: 1,
  },
});
