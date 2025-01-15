import Colors from "@/constants/Colors";
import { MOBILE_HEIGHT, SCREEN_HEIGHT } from "@/constants/Device";
import { RequestDetails } from "@/models/RequestDetails";
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

interface CustomerInformationProps {
  requestDetails: RequestDetails;
}
export default function CustomerInformation({
  requestDetails,
}: CustomerInformationProps) {
  return (
    <View style={styles.container}>
      <AvatarSection requestDetails={requestDetails} />
      <AdditionalDetails requestDetails={requestDetails} />
      <Description requestDetails={requestDetails} />
    </View>
  );
}
function AvatarSection({ requestDetails }: CustomerInformationProps) {
  const callCustomer = () => {
    PerformPhoneCall(requestDetails.customerPhone);
  };
  return (
    <HStack style={styles.avatarStack} space={3}>
      <Avatar source={{ uri: requestDetails.customerAvatar }} size="lg" />
      <VStack>
        <Text fontSize="lg" fontWeight="bold">
          {requestDetails.customerName}
        </Text>
        <Button
          leftIcon={<Icon as={Ionicons} name="call-outline" />}
          backgroundColor={Colors.ewmh.phone}
          size="md"
          onPress={callCustomer}
        >
          <Text color={Colors.ewmh.foreground} fontWeight="bold" fontSize="md">
            {requestDetails.customerPhone}
          </Text>
        </Button>
      </VStack>
    </HStack>
  );
}
function AdditionalDetails({ requestDetails }: CustomerInformationProps) {
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
            Chung cư {requestDetails?.apartment.name},{" "}
            {requestDetails?.apartment?.address}
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
          Căn hộ {requestDetails.roomId}
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
          {requestDetails.customerEmail}
        </Text>
      </HStack>
    </VStack>
  );
}
function Description({ requestDetails }: CustomerInformationProps) {
  return (
    <View style={styles.description}>
      <VStack w="100%">
        <Text fontSize="md" fontWeight="bold">
          Chi tiết yêu cầu
        </Text>
        <ScrollView h="90%" nestedScrollEnabled={true}>
          <Text fontSize="md">{requestDetails.customerProblem}</Text>
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
        ? SCREEN_HEIGHT * 0.71
        : SCREEN_HEIGHT * 0.66,
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
    height:
      SCREEN_HEIGHT < MOBILE_HEIGHT
        ? SCREEN_HEIGHT * 0.28
        : SCREEN_HEIGHT * 0.3,
  },
});
