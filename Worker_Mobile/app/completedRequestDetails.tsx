import { API_Requests_GetById } from "@/api/requests";
import RequestStatusIndicator from "@/components/home/RequestStatusIndicator";
import CustomerInformation from "@/components/requestDetails/CustomerInformation";
import OrderList from "@/components/requestDetails/OrderList";
import WorkerHorizontalList from "@/components/requestDetails/WorkerHorizontalList";
import CustomAlertDialogV2 from "@/components/shared/CustomAlertDialogV2";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import IsRequestPaidIndicator from "@/components/shared/IsRequestPaidIndicator";
import RequestTypeIndicator from "@/components/shared/RequestTypeIndicator";
import UnderWarrantyProductList from "@/components/warrantyRequestDetails/UnderWarrantyProductList";
import Colors from "@/constants/Colors";
import { MOBILE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { REPAIR_REQUEST } from "@/constants/Request";
import {
  ReplacementProduct,
  RequestDetails,
  WarrantyRequest,
} from "@/models/RequestDetails";
import { useLocalSearchParams } from "expo-router";
import { Divider, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function CompletedRequestScreen() {
  const { requestId, requestCategory } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const requestCategoryNum = Number(requestCategory);
  const [requestDetails, setRequestDetails] = useState<RequestDetails>();
  const refresh = () => {
    setIsLoading(true);
    API_Requests_GetById(requestId as string)
      .then((response) => {
        setRequestDetails(response);
      })
      .catch((error) => {
        setIsErrorShown(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    refresh();
  }, []);
  return (
    <>
      {isLoading ? (
        <FullScreenSpinner />
      ) : (
        <>
          {requestDetails === undefined ? null : (
            <ScrollView>
              <VStack style={styles.container}>
                <RequestDetail
                  requestDetails={requestDetails}
                  requestCategoryNum={requestCategoryNum}
                />
                <CustomerDetail requestDetails={requestDetails} />
                <WorkersSection requestDetails={requestDetails} />
                {Number(requestCategory) === REPAIR_REQUEST ? (
                  <OrdersSection requestDetails={requestDetails} />
                ) : (
                  <UnderWarrantyProductsSection
                    requestDetails={requestDetails}
                  />
                )}
              </VStack>
              <CustomAlertDialogV2
                header="Chú ý"
                body="Đã có lỗi xảy ra."
                isShown={isErrorShown}
                hideModal={() => setIsErrorShown(false)}
                proceedText="Chấp nhận"
              />
            </ScrollView>
          )}
        </>
      )}
    </>
  );
}

interface RequestDetailProps {
  requestDetails: RequestDetails;
}
interface RequestDetailProps2 {
  requestDetails: RequestDetails;
  requestCategoryNum: number;
}

function RequestDetail({
  requestDetails,
  requestCategoryNum,
}: RequestDetailProps2) {
  const isRequestPaid = () => {
    const contractId = requestDetails.contractId;
    if (
      (contractId === null || contractId === undefined) &&
      requestCategoryNum == REPAIR_REQUEST
    )
      return true;
    return false;
  };
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
        <Text fontSize="md">Trạng thái</Text>
        <RequestStatusIndicator status={requestDetails.status} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.informationView}>
        <Text fontSize="md">Loại yêu cầu</Text>
        <RequestTypeIndicator requestType={requestCategoryNum} />
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
function WorkersSection({ requestDetails }: RequestDetailProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Danh sách nhân viên</Text>
      <WorkerHorizontalList workers={requestDetails.workers} />
    </View>
  );
}
function OrdersSection({ requestDetails }: RequestDetailProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Đơn hàng đính kèm</Text>

      <OrderList
        replacementProducts={
          requestDetails.replacementProducts as ReplacementProduct[]
        }
        requestDetails={requestDetails}
      />
    </View>
  );
}
interface UnderWarrantyProductsSectionProps {
  requestDetails: RequestDetails;
}
function UnderWarrantyProductsSection({
  requestDetails,
}: UnderWarrantyProductsSectionProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Sản phẩm cần bảo hành</Text>

      <UnderWarrantyProductList
        warrantyRequests={requestDetails.warrantyRequests as WarrantyRequest[]}
        requestDetails={requestDetails}
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
