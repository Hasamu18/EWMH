import Colors from "@/constants/Colors";
import { MOBILE_HEIGHT, SCREEN_HEIGHT } from "@/constants/Device";
import { ShippingOrder } from "@/models/ShippingOrder";
import PerformPhoneCall from "@/utils/PhoneUtils";
import { Ionicons } from "@expo/vector-icons";
import {
  Avatar,
  Button,
  HStack,
  Icon,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CustomerShippingInformationProps {
  shippingOrder: ShippingOrder;
}
export default function CustomerShippingInformation({
  shippingOrder,
}: CustomerShippingInformationProps) {
  return (
    <View style={styles.container}>
      <AvatarSection shippingOrder={shippingOrder} />
      <PersonalDetails shippingOrder={shippingOrder} />
      <Description shippingOrder={shippingOrder} />
    </View>
  );
}
function AvatarSection({ shippingOrder }: CustomerShippingInformationProps) {
  const callCustomer = () => {
    PerformPhoneCall(shippingOrder.cusInfo.phoneNumber);
  };
  return (
    <HStack style={styles.avatarStack} space={3}>
      <Avatar source={{ uri: shippingOrder.cusInfo.avatarUrl }} size="lg" />
      <VStack>
        <Text fontSize="lg" fontWeight="bold">
          {shippingOrder.cusInfo.fullName}
        </Text>
        <Button
          leftIcon={<Icon as={Ionicons} name="call-outline" />}
          backgroundColor={Colors.ewmh.phone}
          size="md"
          onPress={callCustomer}
        >
          <Text color={Colors.ewmh.foreground} fontWeight="bold" fontSize="md">
            {shippingOrder.cusInfo.phoneNumber}
          </Text>
        </Button>
      </VStack>
    </HStack>
  );
}
function PersonalDetails({ shippingOrder }: CustomerShippingInformationProps) {
  return (
    <VStack style={styles.additionalDetailsStack} space={3} w="100%">
      <HStack space={3}>
        <Icon
          as={Ionicons}
          name="location-outline"
          size="xl"
          color={Colors.ewmh.foreground3}
        />
        <ScrollView nestedScrollEnabled h={SCREEN_HEIGHT * 0.1}>
          <Text fontSize="md" fontWeight="bold">
            Chung cư {shippingOrder?.apartment?.name},{" "}
            {shippingOrder?.apartment?.address}
          </Text>
        </ScrollView>
      </HStack>
      <HStack space={3}>
        <Icon
          as={Ionicons}
          name="home-outline"
          size="xl"
          color={Colors.ewmh.foreground3}
        />
        <Text fontSize="md" w="90%" numberOfLines={2} fontWeight="bold">
          Căn hộ {shippingOrder.shippingOrder.address}
        </Text>
      </HStack>
      <HStack space={3}>
        <Icon
          as={Ionicons}
          name="mail-outline"
          size="xl"
          color={Colors.ewmh.foreground3}
        />
        <Text fontSize="md" w="90%" numberOfLines={2} fontWeight="bold">
          {shippingOrder.cusInfo.email}
        </Text>
      </HStack>
    </VStack>
  );
}
function Description({ shippingOrder }: CustomerShippingInformationProps) {
  return (
    <View style={styles.description}>
      <VStack w="100%">
        <Text fontSize="md" fontWeight="bold">
          Ghi chú của khách
        </Text>
        <ScrollView h="90%" nestedScrollEnabled={true}>
          <Text fontSize="md">{shippingOrder.shippingOrder.customerNote}</Text>
        </ScrollView>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderRadius: 10,
    width: "100%",
    height:
      SCREEN_HEIGHT < MOBILE_HEIGHT
        ? SCREEN_HEIGHT * 0.6
        : SCREEN_HEIGHT * 0.52,
    alignItems: "center",
    backgroundColor: Colors.ewmh.background2,
    padding: 20,
  },
  avatarStack: {
    alignItems: "center",
  },
  additionalDetailsStack: {
    marginVertical: 10,
    padding: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  description: {
    backgroundColor: Colors.ewmh.background3,
    borderRadius: 10,
    padding: 15,
    width: "100%",
    height: SCREEN_HEIGHT * 0.15,
  },
});
