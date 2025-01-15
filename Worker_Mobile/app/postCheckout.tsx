import { API_Requests_CompleteRequest } from "@/api/requests";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import Colors from "@/constants/Colors";
import { CompleteRequest } from "@/models/CompleteRequest";
import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Icon, Image, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

export default function PostCheckoutScreen() {
  const { orderCode, conclusion, isCanceled } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const postCheckoutScreenState = useSelector(
    (state: RootState) => state.postCheckoutScreen
  );
  const requestId = postCheckoutScreenState.requestId;

  const completeRequest = () => {
    setIsLoading(true);
    const orderCodeNum = Number(orderCode);
    console.log("Request is not canceled!");
    const completeRequest: CompleteRequest = {
      requestId: requestId,
      conclusion: conclusion as string,
      orderCode: orderCodeNum,
    };
    console.log("CompleteRequest: ", completeRequest);
    API_Requests_CompleteRequest(completeRequest).then(() => {
      console.log("Request is completed.");
      setIsPaid(true);
      setIsLoading(false);
    });
  };
  const isPaymentCanceled = (): boolean => {
    if (isCanceled === undefined) return false;
    return true;
  };
  useEffect(() => {
    if (isPaymentCanceled()) {
      setIsPaid(false);
    } else {
      completeRequest();
    }
  }, []);
  return (
    <View style={styles.container}>
      <>
        {isLoading ? (
          <FullScreenSpinner />
        ) : (
          <>
            {isPaid ? (
              <PaymentSuccess />
            ) : (
              <PaymentFailed requestId={requestId} />
            )}
          </>
        )}
      </>
    </View>
  );
}

function PaymentSuccess() {
  const backToHome = () => {
    router.navigate("/(tabs)/home");
  };
  return (
    <VStack alignItems="center" w="80%">
      <Image
        source={require("../assets/images/checked.png")}
        size="xl"
        marginY="8"
        alt="paymentSuccess"
      />
      <Text fontWeight="bold" fontSize="2xl">
        Thanh toán thành công!
      </Text>
      <Text fontSize="lg" textAlign="center">
        Hãy bấm nút bên dưới để tiếp tục.
      </Text>
      <Button
        style={styles.returnToRequestButton}
        leftIcon={<Icon as={Ionicons} name="arrow-back-outline" />}
        size="sm"
        onPress={backToHome}
      >
        <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
          Trở về trang chủ
        </Text>
      </Button>
    </VStack>
  );
}
interface PaymentFailedProps {
  requestId: string;
}
function PaymentFailed({ requestId }: PaymentFailedProps) {
  const backToRequest = () => {
    router.navigate({
      pathname: "/(tabs)/home",
      params: { requestId: requestId },
    });
  };
  return (
    <VStack alignItems="center">
      <Image
        source={require("../assets/images/cancel.png")}
        size="xl"
        marginY="8"
        alt="paymetFailure"
      />
      <Text fontWeight="bold" fontSize="2xl" textAlign="center">
        Thanh toán thất bại!
      </Text>
      <Text fontSize="lg">Đã có lỗi xảy ra. Xin vui lòng thử lại.</Text>
      <Button
        style={styles.returnToRequestButton}
        leftIcon={<Icon as={Ionicons} name="arrow-back-outline" />}
        size="sm"
        onPress={backToRequest}
      >
        <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
          Trở về yêu cầu sửa chữa
        </Text>
      </Button>
    </VStack>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentContainer: {
    flexDirection: "column",
  },
  returnToRequestButton: {
    backgroundColor: Colors.ewmh.background,
    marginVertical: 20,
  },
  orderButtonText: {
    color: Colors.ewmh.foreground,
  },
});
