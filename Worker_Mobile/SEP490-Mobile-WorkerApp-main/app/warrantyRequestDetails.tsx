import CustomerInformation from "@/components/requestDetails/CustomerInformation";
import ExplainRepairEvidenceModal, {
  ExplainRepairEvidenceModalModes,
} from "@/components/requestDetails/ExplainRepairEvidenceModal";
import PreRepairEvidenceViewer from "@/components/requestDetails/PreRepairEvidence";
import WorkerHorizontalList from "@/components/requestDetails/WorkerHorizontalList";
import CancelRequestButton from "@/components/shared/CancelRequest";
import IsRequestPaidIndicator from "@/components/shared/IsRequestPaidIndicator";
import RequestTypeIndicator from "@/components/shared/RequestTypeIndicator";
import AddUnderWarrantyProductButton from "@/components/warrantyRequestDetails/AddUnderWarrantyProductButton";
import FinishWarrantyRequestButton from "@/components/warrantyRequestDetails/FinishWarrantyRequestButton";
import FinishWarrantyRequestModal from "@/components/warrantyRequestDetails/FinishWarrantyRequestModal";
import UnderWarrantyProductList from "@/components/warrantyRequestDetails/UnderWarrantyProductList";
import Colors from "@/constants/Colors";
import { MOBILE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { COMPLETED, WARRANTY_REQUEST } from "@/constants/Request";
import { RequestDetails, WarrantyRequest } from "@/models/RequestDetails";
import { setRequestId } from "@/redux/screens/warrantyRequestDetailsScreenSlice";
import { FormatDateToCustomString } from "@/utils/DateUtils";

import { IsLeadWorker } from "@/utils/WorkerUtils";
import { Ionicons } from "@expo/vector-icons";

import PostRepairEvidenceViewer from "@/components/requestDetails/PostRepairEvidence";
import { Button, Divider, Icon, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface WarrantyRequestDetailsScreenProps {
  warrantyRequestDetails: RequestDetails;
}
export default function WarrantyRequestDetailsScreen({
  warrantyRequestDetails,
}: WarrantyRequestDetailsScreenProps) {
  useEffect(() => {
    setRequestId(warrantyRequestDetails.requestId);
  }, []);
  return (
    <ScrollView>
      <VStack style={styles.container}>
        <WarrantyRequestDetail requestDetails={warrantyRequestDetails} />
        <CustomerDetail requestDetails={warrantyRequestDetails} />
        <WorkersSection requestDetails={warrantyRequestDetails} />
        <PreRepairEvidenceSection requestDetails={warrantyRequestDetails} />
        {warrantyRequestDetails.preRepairEvidenceUrl && (
          <>
            <UnderWarrantyProductsSection
              requestDetails={warrantyRequestDetails}
            />
            <PostRepairEvidenceSection
              requestDetails={warrantyRequestDetails}
            />
          </>
        )}
        <FinishWarrantyRequestButton requestDetails={warrantyRequestDetails} />
        <FinishWarrantyRequestModal requestDetails={warrantyRequestDetails} />
        <CancelRequestButton requestDetails={warrantyRequestDetails} />
      </VStack>
    </ScrollView>
  );
}

interface WarrantyRequestDetailProps {
  requestDetails: RequestDetails;
}
function WarrantyRequestDetail({ requestDetails }: WarrantyRequestDetailProps) {
  return (
    <VStack w="100%">
      <View style={styles.informationView}>
        <Text fontSize="md">Mã yêu cầu </Text>
        <Text
          fontWeight="bold"
          fontSize="md"
          w={SCREEN_WIDTH < MOBILE_WIDTH ? "50%" : "60%"}
          textAlign="right"
        >
          {requestDetails.requestId}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.informationView}>
        <Text fontSize="md">Ngày yêu cầu </Text>
        <Text
          fontWeight="bold"
          fontSize="md"
          w={SCREEN_WIDTH < MOBILE_WIDTH ? "50%" : "60%"}
          textAlign="right"
        >
          {FormatDateToCustomString(requestDetails.startDate)}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.informationView}>
        <Text fontSize="md">Loại yêu cầu </Text>
        <RequestTypeIndicator requestType={WARRANTY_REQUEST} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.informationView}>
        <Text fontSize="md">Trạng thái thanh toán</Text>
        <IsRequestPaidIndicator isRequestPaid={false} />
      </View>
    </VStack>
  );
}
function CustomerDetail({ requestDetails }: WarrantyRequestDetailProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Thông tin khách hàng</Text>
      <CustomerInformation requestDetails={requestDetails} />
    </View>
  );
}
function WorkersSection({ requestDetails }: WarrantyRequestDetailProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Danh sách nhân viên</Text>
      <WorkerHorizontalList workers={requestDetails.workers} />
    </View>
  );
}

function PreRepairEvidenceSection({
  requestDetails,
}: WarrantyRequestDetailProps) {
  const [isShown, setIsShown] = useState(false);
  return (
    <View style={styles.detailBlock}>
      <VStack space={1} style={{ justifyContent: "center" }}>
        <Text style={styles.title}>Hình trước sửa chữa</Text>
        <Button
          size="lg"
          variant="outline"
          leftIcon={
            <Icon
              as={Ionicons}
              name="alert-circle"
              color={Colors.ewmh.recapture}
            />
          }
          _icon={{ color: Colors.ewmh.foreground }}
          color={Colors.ewmh.foreground}
          onPress={() => setIsShown(true)}
        >
          <Text fontWeight="bold" fontSize="lg">
            Lưu ý
          </Text>
        </Button>
        <PreRepairEvidenceViewer requestDetails={requestDetails} />
      </VStack>
      <ExplainRepairEvidenceModal
        isShown={isShown}
        setIsShown={setIsShown}
        mode={ExplainRepairEvidenceModalModes.PRE_REPAIR}
      />
    </View>
  );
}

function UnderWarrantyProductsSection({
  requestDetails,
}: WarrantyRequestDetailProps) {
  const [isLeadWorker, setIsLeadWorker] = useState<boolean>(false);
  useEffect(() => {
    IsLeadWorker(requestDetails).then((result) => {
      setIsLeadWorker(result);
    });
  }, []);
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Sản phẩm cần bảo hành</Text>
      {isLeadWorker === false ||
      isLeadWorker === undefined ||
      requestDetails.status === COMPLETED ? (
        <UnderWarrantyProductList
          warrantyRequests={
            requestDetails.warrantyRequests as WarrantyRequest[]
          }
          requestDetails={requestDetails}
        />
      ) : (
        <>
          <UnderWarrantyProductList
            warrantyRequests={
              requestDetails.warrantyRequests as WarrantyRequest[]
            }
            requestDetails={requestDetails}
          />
          <AddUnderWarrantyProductButton
            requestId={requestDetails.requestId}
            customerId={requestDetails.customerId}
          />
        </>
      )}
    </View>
  );
}

function PostRepairEvidenceSection({
  requestDetails,
}: WarrantyRequestDetailProps) {
  const [isShown, setIsShown] = useState(false);
  return (
    <View style={styles.detailBlock}>
      <VStack space={1} style={{ justifyContent: "center" }}>
        <Text style={styles.title}>Nghiệm thu & Bằng chứng</Text>
        <Button
          size="lg"
          variant="outline"
          leftIcon={
            <Icon
              as={Ionicons}
              name="alert-circle"
              color={Colors.ewmh.recapture}
            />
          }
          _icon={{ color: Colors.ewmh.foreground }}
          color={Colors.ewmh.foreground}
          onPress={() => setIsShown(true)}
        >
          <Text fontWeight="bold" fontSize="lg">
            Lưu ý
          </Text>
        </Button>

        <PostRepairEvidenceViewer requestDetails={requestDetails} />
      </VStack>
      <ExplainRepairEvidenceModal
        isShown={isShown}
        setIsShown={setIsShown}
        mode={ExplainRepairEvidenceModalModes.POST_REPAIR}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 15,
  },
  divider: {
    marginVertical: 5,
  },
  requestDetail: {
    height: "50%",
    marginTop: 2,
    flexDirection: "column",
  },
  checkoutButton: {
    flexDirection: "row",
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.05,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  orderButtonText: {
    color: Colors.ewmh.foreground,
  },
  informationView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center",
  },
  detailBlock: {
    width: "100%",
    marginTop: 8,
    flexDirection: "column",
  },
});
