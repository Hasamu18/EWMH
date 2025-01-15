import {
  SHIPPING_ASSIGNED,
  SHIPPING_DELAYED,
  SHIPPING_DELIVERING,
} from "@/constants/Shipping";
import { ShippingOrder } from "@/models/ShippingOrder";
import { Ionicons } from "@expo/vector-icons";
import { Box, HStack, Icon, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";

import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import EmptyList from "../shared/EmptyList";
import ShippingOrderCard from "./ShippingOrderCard";

interface ShippingOrderAccordionsProps {
  shippingOrders: ShippingOrder[];
}

enum SectionName {
  ProcessingOrder = "processingOrder",
  DelayedOrder = "delayedOrder",
  AssignedOrder = "assignedOrder",
}

export default function ShippingOrderAccordions({
  shippingOrders,
}: ShippingOrderAccordionsProps) {
  const [expandedSection, setExpandedSection] = useState<SectionName | null>(
    null
  );

  const toggleSection = (sectionName: SectionName) => {
    setExpandedSection((prevSection) =>
      prevSection === sectionName ? null : sectionName
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Box>
        <TouchableOpacity
          onPress={() => toggleSection(SectionName.ProcessingOrder)}
        >
          <HStack style={styles.inProgressSectionHeader}>
            <Icon
              as={Ionicons}
              name="reload-circle-outline"
              color={Colors.ewmh.foreground}
              size="lg"
            />
            <Text style={styles.sectionHeaderText}>Đang giao</Text>
          </HStack>
        </TouchableOpacity>
        <Collapsible
          collapsed={expandedSection !== SectionName.ProcessingOrder}
        >
          <DeliveringOrderSection shippingOrders={shippingOrders} />
        </Collapsible>

        <TouchableOpacity
          onPress={() => toggleSection(SectionName.DelayedOrder)}
        >
          <HStack style={styles.delayedSectionHeader}>
            <Icon
              as={Ionicons}
              name="pause-outline"
              color={Colors.ewmh.foreground}
              size="lg"
            />
            <Text style={styles.sectionHeaderText}>Đang tạm hoãn</Text>
          </HStack>
          <Collapsible collapsed={expandedSection !== SectionName.DelayedOrder}>
            <DelayedOrderSection shippingOrders={shippingOrders} />
          </Collapsible>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleSection(SectionName.AssignedOrder)}
        >
          <HStack style={styles.assignedSectionHeader}>
            <Icon
              as={Ionicons}
              name="checkmark-done-outline"
              color={Colors.ewmh.foreground}
              size="lg"
            />
            <Text style={styles.sectionHeaderText}>Đã tiếp nhận</Text>
          </HStack>
        </TouchableOpacity>
        <Collapsible collapsed={expandedSection !== SectionName.AssignedOrder}>
          <AssignedOrderSection shippingOrders={shippingOrders} />
        </Collapsible>
      </Box>
    </ScrollView>
  );
}

function DeliveringOrderSection({
  shippingOrders,
}: ShippingOrderAccordionsProps) {
  const [deliveringOrders, setDeliveringOrders] = useState<ShippingOrder[]>();
  useEffect(() => {
    const filteredOrders = shippingOrders
      .filter((order) => order.shippingOrder.status === SHIPPING_DELIVERING)
      .sort(
        (a, b) =>
          new Date(b.shippingOrder.shipmentDate).getTime() -
          new Date(a.shippingOrder.shipmentDate).getTime()
      );
    setDeliveringOrders(filteredOrders);
  }, []);
  return (
    <>
      {deliveringOrders === null ||
      deliveringOrders === undefined ||
      deliveringOrders?.length === 0 ? (
        <View style={{ marginVertical: SCREEN_HEIGHT * 0.02 }}>
          <EmptyList />
        </View>
      ) : (
        <ScrollView w="100%" style={styles.scrollView}>
          <VStack w="100%">
            {deliveringOrders.map((order, key) => {
              return <ShippingOrderCard shippingOrder={order} key={key} />;
            })}
          </VStack>
        </ScrollView>
      )}
    </>
  );
}

function DelayedOrderSection({ shippingOrders }: ShippingOrderAccordionsProps) {
  const [delayedOrders, setDelayedOrders] = useState<ShippingOrder[]>();
  useEffect(() => {
    const filteredOrders = shippingOrders
      .filter((order) => order.shippingOrder.status === SHIPPING_DELAYED)
      .sort(
        (a, b) =>
          new Date(b.shippingOrder.shipmentDate).getTime() -
          new Date(a.shippingOrder.shipmentDate).getTime()
      );
    setDelayedOrders(filteredOrders);
  }, []);
  return (
    <>
      {delayedOrders === null ||
      delayedOrders === undefined ||
      delayedOrders?.length === 0 ? (
        <View style={{ marginVertical: SCREEN_HEIGHT * 0.02 }}>
          <EmptyList />
        </View>
      ) : (
        <ScrollView w="100%" style={styles.scrollView}>
          <VStack w="100%">
            {delayedOrders.map((order, key) => {
              return <ShippingOrderCard shippingOrder={order} key={key} />;
            })}
          </VStack>
        </ScrollView>
      )}
    </>
  );
}

function AssignedOrderSection({
  shippingOrders,
}: ShippingOrderAccordionsProps) {
  const [assignedOrders, setAssignedOrders] = useState<ShippingOrder[]>();
  useEffect(() => {
    const filteredOrders = shippingOrders
      .filter((order) => order.shippingOrder.status === SHIPPING_ASSIGNED)
      .sort(
        (a, b) =>
          new Date(b.shippingOrder.shipmentDate).getTime() -
          new Date(a.shippingOrder.shipmentDate).getTime()
      );
    setAssignedOrders(filteredOrders);
  }, []);
  return (
    <>
      {assignedOrders === null ||
      assignedOrders === undefined ||
      assignedOrders?.length === 0 ? (
        <View style={{ marginVertical: SCREEN_HEIGHT * 0.02 }}>
          <EmptyList />
        </View>
      ) : (
        <ScrollView w="100%" style={styles.scrollView}>
          <VStack w="100%">
            {assignedOrders.map((order, key) => {
              return <ShippingOrderCard shippingOrder={order} key={key} />;
            })}
          </VStack>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: { padding: 10, width: "100%" },
  assignedSectionHeader: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: Colors.ewmh.shippingOrderStatus.assignedOrder,
    marginVertical: 10,
    alignItems: "center",
  },
  delayedSectionHeader: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: Colors.ewmh.shippingOrderStatus.delayed,
    marginVertical: 10,
    alignItems: "center",
  },
  inProgressSectionHeader: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: Colors.ewmh.shippingOrderStatus.inProgress,
    marginVertical: 10,
    alignItems: "center",
  },
  sectionHeaderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
