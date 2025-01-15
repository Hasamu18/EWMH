import Colors from "@/constants/Colors";
import { setIsLoading } from "@/redux/screens/homeScreenSlice";
import { Ionicons } from "@expo/vector-icons";
import { Icon, IconButton, Image, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";

import { useDispatch } from "react-redux";

export default function NoRequestsFound() {
  const dispatch = useDispatch();
  return (
    <VStack alignItems="center" w="80%">
      <Image
        source={require("../../assets/images/no-request-found.png")}
        size="xl"
        marginY="8"
        alt="paymentSuccess"
      />
      <Text fontWeight="bold" fontSize="2xl">
        Chưa có yêu cầu mới
      </Text>
      <Text fontSize="lg" textAlign="center" width="80%">
        Bạn hãy đợi trưởng nhóm gán cho 1 yêu cầu mới nhé.
      </Text>

      <IconButton
        size="lg"
        icon={<Icon as={Ionicons} name="refresh-circle-outline" />}
        _icon={{ color: Colors.ewmh.background, size: "5xl" }}
        onPress={() => {
          dispatch(setIsLoading(true));
        }}
      />
    </VStack>
  );
}

const styles = StyleSheet.create({
  refreshButton: {},
});
