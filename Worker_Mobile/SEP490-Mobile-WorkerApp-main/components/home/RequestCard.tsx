import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { Request } from "@/models/Request";

import { REPAIR_REQUEST, WARRANTY_REQUEST } from "@/constants/Request";
import { FormatDateToCustomString } from "@/utils/DateUtils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Divider, HStack, Icon, Text, VStack } from "native-base";
import { StyleSheet, View } from "react-native";
import RequestStatusIndicator from "./RequestStatusIndicator";

interface RequestCardProps {
  request: Request;
}
export default function RequestCard({ request }: RequestCardProps) {
  const goToDetails = () => {
    if (request.categoryRequest === WARRANTY_REQUEST) {
      router.push({
        pathname: "/warrantyRequestDetails",
        params: { requestId: request.requestId },
      });
    } else if (request.categoryRequest === REPAIR_REQUEST) {
      router.push({
        pathname: "/requestDetails",
        params: { requestId: request.requestId },
      });
    }
  };
  return (
    <View style={styles.container}>
      <VStack w="100%">
        <HStack style={styles.informationView}>
          <Text fontWeight="bold" fontSize="md" style={styles.id}>
            {request.requestId}
          </Text>
          <RequestStatusIndicator status={request.status} />
        </HStack>
        <View style={styles.informationView}>
          <Text fontSize="md">Căn hộ: </Text>
          <Text fontWeight="bold" fontSize="md">
            {request.roomId}
          </Text>
        </View>
        <View style={styles.informationView}>
          <Text fontSize="md">Ngày yêu cầu: </Text>
          <Text fontWeight="bold" fontSize="md">
            {FormatDateToCustomString(request.start)}
          </Text>
        </View>
        <Button
          style={styles.showDetailsButton}
          leftIcon={<Icon as={Ionicons} name="add-circle-outline" />}
          size="sm"
          onPress={goToDetails}
        >
          <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
            Xem chi tiết
          </Text>
        </Button>
        <Divider style={styles.divider} />
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    overflow: "hidden",
  },
  divider: {
    marginVertical: 2,
    color: Colors.ewmh.background,
  },
  informationView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  id: {
    color: Colors.ewmh.background,
  },
  showDetailsButton: {
    flexDirection: "row",
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  orderButtonText: {
    color: Colors.ewmh.foreground,
  },
});
