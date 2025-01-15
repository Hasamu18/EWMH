import {
  API_Shipping_GetShippingOrderDetails,
  API_Shipping_GetShippingOrders,
} from "@/api/shipping";
import EmptyList from "@/components/shared/EmptyList";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";

import CustomerShippingInformation from "@/components/shipping/CustomerShippingInformation";
import ShippingOrderDetailsCard from "@/components/shippingOrderDetails/ShippingOrderDetailsCard";
import ShippingOrderDetailsModal from "@/components/shippingOrderDetails/ShippingOrderDetailsModal";
import ShippingStatusIndicator from "@/components/shippingOrderDetails/ShippingStatusIndicator";
import UpdateShippingStatusButtonGroups from "@/components/shippingOrderDetails/UpdateShippingStatusButtonGroups";
import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { ShippingOrder } from "@/models/ShippingOrder";
import {
  resetProofOfDelivery,
  setImageUri,
} from "@/redux/screens/captureProofOfDeliveryScreenSlice";
import { setIsLoading } from "@/redux/screens/shippingOrderDetailsScreenSlice";
import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Button,
  Divider,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ShippingOrderDetails } from "../models/ShippingOrderDetails";
import { FormatDateToCustomString } from "@/utils/DateUtils";

export default function ShippingOrderDetailsScreen() {
  const { shippingId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [shippingOrder, setShippingOrder] = useState<ShippingOrder>();
  const isLoading = useSelector(
    (state: RootState) => state.shippingOrderDetailsScreen.isLoading
  );
  useEffect(() => {
    if (isLoading)
      API_Shipping_GetShippingOrders(shippingId as string).then((response) => {
        const result = response[0];
        setShippingOrder(result);
        dispatch(setIsLoading(false));
      });
  }, [isLoading]);

  //Cleans up the snapshot if the Worker exits this screen.
  useEffect(() => {
    return () => {
      dispatch(resetProofOfDelivery());
    };
  }, []);

  return (
    <>
      {shippingOrder === undefined ? (
        <FullScreenSpinner />
      ) : (
        <ScrollView>
          <VStack style={styles.container}>
            <ShippingBriefDetail
              shippingOrder={shippingOrder as ShippingOrder}
            />
            <CustomerDetail shippingOrder={shippingOrder as ShippingOrder} />
            <ShippingOrdersSection
              shippingOrder={shippingOrder as ShippingOrder}
            />
            <ProofOfDeliveryViewer />
            <UpdateShippingStatusButtonGroups
              shippingOrder={shippingOrder as ShippingOrder}
            />
            <ShippingOrderDetailsModal />
          </VStack>
        </ScrollView>
      )}
    </>
  );
}

interface ShippingOrderDetailsProps {
  shippingOrder: ShippingOrder;
}
function ShippingBriefDetail({ shippingOrder }: ShippingOrderDetailsProps) {
  return (
    <VStack w="100%" space={1}>
      <View style={styles.informationView}>
        <Text fontSize="md">Mã vận đơn </Text>
        <Text fontWeight="bold" fontSize="md" w="50%" textAlign="right">
          {shippingOrder.shippingOrder.shippingId}
        </Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.informationView}>
        <Text fontSize="md">Ngày đặt hàng</Text>
        <Text fontWeight="bold" fontSize="md" w="50%" textAlign="right">
          {FormatDateToCustomString(shippingOrder.shippingOrder.shipmentDate)}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.informationView}>
        <Text fontSize="md">Trạng thái vận đơn</Text>
        <ShippingStatusIndicator status={shippingOrder.shippingOrder.status} />
      </View>
      <Divider style={styles.divider} />
    </VStack>
  );
}
function CustomerDetail({ shippingOrder }: ShippingOrderDetailsProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Thông tin khách hàng</Text>
      <CustomerShippingInformation shippingOrder={shippingOrder} />
    </View>
  );
}

function ShippingOrdersSection({ shippingOrder }: ShippingOrderDetailsProps) {
  const [shippingOrderDetails, setShippingOrderDetails] =
    useState<ShippingOrderDetails>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    API_Shipping_GetShippingOrderDetails(
      shippingOrder.shippingOrder.shippingId
    ).then((response) => {
      setShippingOrderDetails(response);
      setIsLoading(false);
    });
  }, []);
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.title}>Chi tiết đơn hàng</Text>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {shippingOrderDetails === undefined ? (
            <EmptyList />
          ) : (
            <SodList shippingOrderDetails={shippingOrderDetails} />
          )}
        </>
      )}
    </View>
  );
}

function ProofOfDeliveryViewer() {
  const proofOfDeliveryImg = useSelector(
    (state: RootState) => state.captureProofOfDeliveryScreen.imageUri
  );
  const dispatch = useDispatch();
  const retakePhoto = () => {
    dispatch(setImageUri(undefined));
    router.push("/captureProofOfDelivery");
  };
  return (
    <>
      {proofOfDeliveryImg !== undefined && (
        <View style={styles.detailBlock}>
          <Text style={styles.title}>Xác nhận giao hàng</Text>
          <VStack space={3}>
            <Image
              source={{ uri: proofOfDeliveryImg }}
              style={styles.proofOfDeliveryImage}
              borderRadius={15}
              alt="proofOfDeliveryImage"
            />
            <Button
              style={styles.retakeButton}
              onPress={retakePhoto}
              leftIcon={<Icon as={Ionicons} name="camera-outline" />}
            >
              <Text color={Colors.ewmh.foreground} fontWeight="bold">
                Chụp lại
              </Text>
            </Button>
          </VStack>
        </View>
      )}
    </>
  );
}

interface SodListProps {
  shippingOrderDetails: ShippingOrderDetails;
}

function SodList({ shippingOrderDetails }: SodListProps) {
  return (
    <View style={styles.sodListContainer}>
      <ScrollView h="100%" nestedScrollEnabled={true}>
        {shippingOrderDetails.result.map((sod, key) => {
          return <ShippingOrderDetailsCard shippingOrderItem={sod} key={key} />;
        })}
      </ScrollView>
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
  sodListContainer: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.48,
    marginVertical: 10,
    flexDirection: "column",
    borderRadius: 10,
    padding: 15,
    backgroundColor: Colors.ewmh.background2,
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
  proofOfDeliveryImage: {
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.5,
  },
  retakeButton: {
    backgroundColor: Colors.ewmh.background,
  },
});
