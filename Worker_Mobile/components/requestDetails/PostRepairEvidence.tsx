import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { GetPostRepairHtml } from "@/constants/RepairEvidence";
import { RequestDetails } from "@/models/RequestDetails";
import {
  removeAcceptanceReportImageByIndex,
  removeRepairCompletedImageByIndex,
  setRecapture,
  setRequestId,
} from "@/redux/screens/capturePostRepairEvidenceScreenSlice";

import { ImagePathToBase64 } from "@/utils/ImageUtils";
import { Ionicons } from "@expo/vector-icons";
import { printToFileAsync } from "expo-print";
import { router } from "expo-router";
import { Button, HStack, Icon, Text, VStack } from "native-base";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";
import MultipleImageTaker from "./MultipleImageTaker";

interface PostRepairEvidenceViewerProps {
  requestDetails: RequestDetails;
}

export default function PostRepairEvidenceViewer({
  requestDetails,
}: PostRepairEvidenceViewerProps) {
  const isRecapture = useSelector(
    (state: RootState) => state.capturePostRepairEvidenceScreen.isRecapture
  );
  return (
    <VStack space={3}>
      {!requestDetails.postRepairEvidenceUrl || isRecapture ? (
        <CapturePostRepairEvidence requestDetails={requestDetails} />
      ) : (
        <ViewPostRepairEvidence requestDetails={requestDetails} />
      )}
    </VStack>
  );
}

interface ViewPostRepairEvidenceProps {
  requestDetails: RequestDetails;
}
function ViewPostRepairEvidence({
  requestDetails,
}: ViewPostRepairEvidenceProps) {
  const dispatch = useDispatch();
  const [isWarningShown, setIsWarningShown] = useState(false);
  const goToViewEvidenceScreen = () => {
    dispatch(setRequestId(requestDetails.requestId));
    router.push({
      pathname: "/postRepairEvidenceViewer",
      params: {
        viewPdfUrl: requestDetails.postRepairEvidenceUrl,
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
        body="Bạn có chắc chắn muốn chụp lại nghiệm thu và bằng chứng sửa chữa đã hoàn thành?"
        action={() => dispatch(setRecapture(true))}
      />
    </HStack>
  );
}

function CapturePostRepairEvidence({
  requestDetails,
}: PostRepairEvidenceViewerProps) {
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const acceptanceReportImages = useSelector(
    (state: RootState) =>
      state.capturePostRepairEvidenceScreen.acceptanceReportImages
  );
  const repairCompletedImages = useSelector(
    (state: RootState) =>
      state.capturePostRepairEvidenceScreen.repairCompletedImages
  );

  const areImagesValid = (): boolean => {
    if (acceptanceReportImages.length === 0) {
      setError("Bạn phải chụp ít nhất 1 bằng chứng nghiệm thu.");
      setIsErrorShown(true);
      return false;
    }
    if (repairCompletedImages.length === 0) {
      setError("Bạn phải chụp ít nhất 1 bằng chứng đã sửa xong.");
      setIsErrorShown(true);
      return false;
    }
    return true;
  };

  const convertImagesToBase64 = async (
    acceptanceReportImages: string[],
    repairCompletedImages: string[]
  ) => {
    const acceptanceReportImagesB64 = await Promise.all(
      acceptanceReportImages.map((ar) => ImagePathToBase64(ar))
    );
    const repairCompletedImagesB64 = await Promise.all(
      repairCompletedImages.map((ar) => ImagePathToBase64(ar))
    );
    return {
      arb64: acceptanceReportImagesB64,
      rcb64: repairCompletedImagesB64,
    };
  };

  const generatePostRepairPdf = async () => {
    if (!areImagesValid()) return;
    setIsProcessing(true);
    const b64Images = await convertImagesToBase64(
      acceptanceReportImages,
      repairCompletedImages
    );
    const html = GetPostRepairHtml(b64Images.arb64, b64Images.rcb64);
    const pdf = await printToFileAsync({ html: html, base64: false });
    setIsProcessing(false);
    router.push({
      pathname: "/postRepairEvidenceViewer",
      params: { submitPdfUrl: pdf.uri, requestId: requestDetails.requestId },
    });
  };
  return (
    <VStack style={styles.capturePostRequestEvidenceContainer}>
      <AcceptanceReportContainer />
      <RepairCompletedImageContainer />
      {isProcessing ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          style={styles.continueToPdfButton}
          leftIcon={
            <Icon as={Ionicons} name="arrow-forward-circle" size="md" />
          }
          onPress={generatePostRepairPdf}
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

function AcceptanceReportContainer() {
  const dispatch = useDispatch();
  const images = useSelector(
    (state: RootState) =>
      state.capturePostRepairEvidenceScreen.acceptanceReportImages
  );
  const removeImage = (index: number) => {
    dispatch(removeAcceptanceReportImageByIndex(index));
  };
  return (
    <VStack padding={1} alignItems="center">
      <Text fontWeight="bold" fontSize="md">
        {`Hình chụp nghiệm thu`}
      </Text>
      <MultipleImageTaker
        route={"/capturePostRepairEvidence"}
        images={images}
        removeImage={removeImage}
        maxCount={10}
        isScanner
      />
    </VStack>
  );
}

function RepairCompletedImageContainer() {
  const dispatch = useDispatch();
  const images = useSelector(
    (state: RootState) =>
      state.capturePostRepairEvidenceScreen.repairCompletedImages
  );
  const removeImage = (index: number) => {
    dispatch(removeRepairCompletedImageByIndex(index));
  };
  return (
    <VStack padding={1} alignItems="center">
      <Text fontWeight="bold" fontSize="md">{`Bằng chứng sửa xong`}</Text>
      <MultipleImageTaker
        route={"/capturePostRepairEvidence"}
        images={images}
        removeImage={removeImage}
        maxCount={10}
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
  postRepairEvidence: {
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.5,
  },
  viewEvidenceButton: {
    backgroundColor: Colors.ewmh.background,
    flex: 5,
  },
  findOutMoreButton: {
    backgroundColor: Colors.ewmh.recapture,
    width: "100%",
  },
  continueToPdfButton: {
    backgroundColor: Colors.ewmh.background,
    width: "100%",
  },
  recaptureButton: {
    backgroundColor: Colors.ewmh.recapture,
    flex: 5,
    marginLeft: 1,
  },
  capturePostRequestEvidenceContainer: {
    height: SCREEN_HEIGHT * 0.6,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.ewmh.background2,
    overflow: "hidden",
  },
});
