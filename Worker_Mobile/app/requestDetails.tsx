import AddReplacementProductButton from "@/components/requestDetails/AddReplacementProductButton";
import ChoosePaymentMethod from "@/components/requestDetails/ChoosePaymentMethod";
import CustomerInformation from "@/components/requestDetails/CustomerInformation";
import ExplainRepairEvidenceModal, {
  ExplainRepairEvidenceModalModes,
} from "@/components/requestDetails/ExplainRepairEvidenceModal";
import OrderList from "@/components/requestDetails/OrderList";
import PostRepairEvidenceViewer from "@/components/requestDetails/PostRepairEvidence";
import PreRepairEvidenceViewer from "@/components/requestDetails/PreRepairEvidence";
import WorkerHorizontalList from "@/components/requestDetails/WorkerHorizontalList";
import CancelRequestButton from "@/components/shared/CancelRequest";
import IsRequestPaidIndicator from "@/components/shared/IsRequestPaidIndicator";
import RequestTypeIndicator from "@/components/shared/RequestTypeIndicator";
import Colors from "@/constants/Colors";
import { MOBILE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { COMPLETED, REPAIR_REQUEST } from "@/constants/Request";
import { ReplacementProduct, RequestDetails } from "@/models/RequestDetails";
import {
  setChoosePaymentMethodModalState,
  setRequestId,
} from "@/redux/components/choosePaymentMethodModalSlice";
import { IsLeadWorker } from "@/utils/WorkerUtils";
import { Ionicons } from "@expo/vector-icons";
import { Button, Divider, Icon, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { FormatDateToCustomString } from "../utils/DateUtils";

interface RequestDetailsScreenProps {
  requestDetails: RequestDetails;
}
export default function RequestDetailsScreen({
  requestDetails,
}: RequestDetailsScreenProps) {
  return (
    <>
      <ScrollView>
        <VStack style={styles.container}>
          <RequestDetail requestDetails={requestDetails} />
          <CustomerDetail requestDetails={requestDetails} />
          <WorkersSection requestDetails={requestDetails} />
          <PreRepairEvidenceSection requestDetails={requestDetails} />
          {requestDetails.preRepairEvidenceUrl && (
            <>
              <OrdersSection requestDetails={requestDetails} />
              <PostRepairEvidenceSection requestDetails={requestDetails} />
            </>
          )}
          <CheckoutSection requestDetails={requestDetails} />
          <ChoosePaymentMethod requestDetails={requestDetails} />
          <CancelRequestButton requestDetails={requestDetails} />
        </VStack>
      </ScrollView>
    </>
  );
}

interface RequestDetailProps {
  requestDetails: RequestDetails;
}
function RequestDetail({ requestDetails }: RequestDetailProps) {
  const isRequestPaid = () => {
    const contractId = requestDetails.contractId;
    if (contractId === null || contractId === undefined) return true;
    return false;
  };
  return (
    <VStack w="100%" space={1}>
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
        <Text fontSize="md">Loại yêu cầu</Text>
        <RequestTypeIndicator requestType={REPAIR_REQUEST} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.informationView}>
        <Text fontSize="md">Trạng thái thanh toán</Text>
        <IsRequestPaidIndicator isRequestPaid={isRequestPaid()} />
      </View>
    </VStack>
  );
}
function CustomerDetail({ requestDetails }: RequestDetailProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Thông tin khách hàng</Text>
      <CustomerInformation requestDetails={requestDetails} />
    </View>
  );
}
function PreRepairEvidenceSection({ requestDetails }: RequestDetailProps) {
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
function WorkersSection({ requestDetails }: RequestDetailProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Danh sách nhân viên</Text>
      <WorkerHorizontalList workers={requestDetails.workers} />
    </View>
  );
}
function OrdersSection({ requestDetails }: RequestDetailProps) {
  const [isLeadWorker, setIsLeadWorker] = useState<boolean>(false);
  useEffect(() => {
    IsLeadWorker(requestDetails).then((result) => {
      setIsLeadWorker(result);
    });
  }, []);
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Đơn hàng đính kèm</Text>
      {isLeadWorker === false ||
      isLeadWorker === undefined ||
      requestDetails.status === COMPLETED ? (
        <OrderList
          replacementProducts={
            requestDetails.replacementProducts as ReplacementProduct[]
          }
          requestDetails={requestDetails}
        />
      ) : (
        <>
          <OrderList
            replacementProducts={
              requestDetails.replacementProducts as ReplacementProduct[]
            }
            requestDetails={requestDetails}
          />
          <AddReplacementProductButton requestId={requestDetails.requestId} />
        </>
      )}
    </View>
  );
}
function PostRepairEvidenceSection({ requestDetails }: RequestDetailProps) {
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
function CheckoutSection({ requestDetails }: RequestDetailProps) {
  const [isLeadWorker, setIsLeadWorker] = useState<boolean>(false);
  const dispatch = useDispatch();
  const openChoosePaymentDialog = () => {
    dispatch(setRequestId(requestDetails.requestId));
    dispatch(setChoosePaymentMethodModalState(true));
  };
  useEffect(() => {
    IsLeadWorker(requestDetails).then((result) => {
      setIsLeadWorker(result);
    });
  }, []);
  return (
    <>
      {isLeadWorker === false ||
      isLeadWorker === undefined ||
      requestDetails.status === COMPLETED ||
      !requestDetails.preRepairEvidenceUrl ||
      !requestDetails.postRepairEvidenceUrl ? null : (
        <Button
          style={styles.checkoutButton}
          leftIcon={<Icon as={Ionicons} name="card-outline" size="md" />}
          size="sm"
          onPress={openChoosePaymentDialog}
        >
          <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
            Hoàn thành yêu cầu
          </Text>
        </Button>
      )}
    </>
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
