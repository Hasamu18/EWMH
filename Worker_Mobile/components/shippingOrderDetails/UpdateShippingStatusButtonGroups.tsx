import {
  API_Shipping_CompleteShipping,
  API_Shipping_ContinueShipping,
  API_Shipping_DelayShipping,
} from "@/api/shipping";
import Colors from "@/constants/Colors";
import { MOBILE_HEIGHT, SCREEN_HEIGHT } from "@/constants/Device";
import { SUCCESS } from "@/constants/HttpCodes";
import {
  SHIPPING_ASSIGNED,
  SHIPPING_DELAYED,
  SHIPPING_DELIVERING,
} from "@/constants/Shipping";
import { ShippingOrder } from "@/models/ShippingOrder";
import { resetProofOfDelivery } from "@/redux/screens/captureProofOfDeliveryScreenSlice";
import { setIsLoading } from "@/redux/screens/shippingOrderDetailsScreenSlice";
import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Icon, Text } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";

interface UpdateShippingStatusButtonGroupsProps {
  shippingOrder: ShippingOrder;
}

export default function UpdateShippingStatusButtonGroups({
  shippingOrder,
}: UpdateShippingStatusButtonGroupsProps) {
  return (
    <>
      {(shippingOrder?.shippingOrder.status === SHIPPING_ASSIGNED ||
        shippingOrder?.shippingOrder.status === SHIPPING_DELAYED) && (
        <StartDeliveryButton shippingOrder={shippingOrder as ShippingOrder} />
      )}
      {shippingOrder?.shippingOrder.status === SHIPPING_DELIVERING && (
        <>
          <DelayDeliveryButton shippingOrder={shippingOrder as ShippingOrder} />
          <CompleteDeliveryButton
            shippingOrder={shippingOrder as ShippingOrder}
          />
        </>
      )}
    </>
  );
}

interface UpdateShippingStatusButtonProps {
  shippingOrder: ShippingOrder;
}

function StartDeliveryButton({
  shippingOrder,
}: UpdateShippingStatusButtonProps) {
  const dispatch = useDispatch();
  const [modalShown, setModalShown] = useState(false);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [isStartingDelivery, setIsStartingDelivery] = useState(false);
  const [buttonLabel, setButtonLabel] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [dialogMsg, setDialogMsg] = useState<string>("");
  const startDelivery = () => {
    setIsStartingDelivery(true);
    API_Shipping_ContinueShipping(shippingOrder.shippingOrder.shippingId)
      .then((response) => {
        if (response.status !== SUCCESS) {
          response.text().then((error) => {
            setError(error);
            setIsErrorShown(true);
          });
        } else {
          dispatch(setIsLoading(true));
        }
      })
      .finally(() => {
        setModalShown(false);
      });
  };
  useEffect(() => {
    setButtonLabel(
      shippingOrder.shippingOrder.status === SHIPPING_ASSIGNED
        ? "Bắt đầu vận đơn"
        : " Tiếp tục vận đơn"
    );
    setDialogMsg(
      shippingOrder.shippingOrder.status === SHIPPING_ASSIGNED
        ? "Bạn có muốn bắt đầu vận đơn này?"
        : "Bạn có muốn tiếp tục vận đơn này?"
    );
  }, []);
  return (
    <>
      <Button
        style={styles.updateStatusButton}
        leftIcon={<Icon as={Ionicons} name="play-circle-outline" />}
        backgroundColor={Colors.ewmh.shippingOrderStatus.inProgress}
        size="lg"
        onPress={() => setModalShown(true)}
      >
        <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
          {buttonLabel}
        </Text>
      </Button>
      <CustomAlertDialogV2
        header="Chú ý"
        body={dialogMsg}
        isShown={modalShown}
        hideModal={() => setModalShown(false)}
        proceedText="Có"
        cancelText="Không"
        action={startDelivery}
        isActionExecuting={isStartingDelivery}
      />
      <CustomAlertDialogV2
        header="Chú ý"
        body={error}
        isShown={isErrorShown}
        hideModal={() => setIsErrorShown(false)}
        proceedText="Chấp nhận"
      />
    </>
  );
}

function DelayDeliveryButton({
  shippingOrder,
}: UpdateShippingStatusButtonProps) {
  const dispatch = useDispatch();
  const [modalShown, setModalShown] = useState(false);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [isDelayingDelivery, setIsDelayingDelivery] = useState(false);
  const [error, setError] = useState<string>("");
  const delayDelivery = () => {
    setIsDelayingDelivery(true);
    dispatch(resetProofOfDelivery());
    API_Shipping_DelayShipping(shippingOrder.shippingOrder.shippingId)
      .then((response) => {
        if (response.status !== SUCCESS) {
          response.text().then((error) => {
            setError(error);
            setIsErrorShown(true);
          });
        } else {
          dispatch(setIsLoading(true));
        }
      })
      .finally(() => {
        setModalShown(false);
      });
  };
  return (
    <>
      <Button
        style={styles.updateStatusButton}
        leftIcon={<Icon as={Ionicons} name="pause-circle-outline" />}
        backgroundColor={Colors.ewmh.shippingOrderStatus.delayed}
        size="lg"
        onPress={() => setModalShown(true)}
      >
        <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
          Tạm hoãn vận đơn
        </Text>
      </Button>
      <CustomAlertDialogV2
        header="Chú ý"
        body="Bạn có muốn tạm hoãn vận đơn này?"
        isShown={modalShown}
        hideModal={() => setModalShown(false)}
        proceedText="Có"
        cancelText="Không"
        action={delayDelivery}
        isActionExecuting={isDelayingDelivery}
      />
      <CustomAlertDialogV2
        header="Chú ý"
        body={error}
        isShown={isErrorShown}
        hideModal={() => setIsErrorShown(false)}
        proceedText="Chấp nhận"
      />
    </>
  );
}

function CompleteDeliveryButton({
  shippingOrder,
}: UpdateShippingStatusButtonProps) {
  const dispatch = useDispatch();
  const proofOfDeliveryImage = useSelector(
    (state: RootState) => state.captureProofOfDeliveryScreen.imageUri
  );
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [isCompletingDelivery, setIsCompletingDelivery] = useState(false);
  const [captureProofOfDeliveryShown, setCaptureProofOfDeliveryShown] =
    useState(false);
  const [error, setError] = useState("");
  const [completeDeliveryShown, setCompleteDeliveryShown] = useState(false);
  const [buttonLabel, setButtonLabel] = useState<string>("");
  const goToCaptureProofOfDelivery = () => {
    router.navigate("/captureProofOfDelivery");
  };
  const completeDelivery = () => {
    setIsCompletingDelivery(true);
    if (proofOfDeliveryImage)
      API_Shipping_CompleteShipping(
        shippingOrder.shippingOrder.shippingId,
        proofOfDeliveryImage
      )
        .then((response) => {
          if (response.status !== SUCCESS) {
            response.text().then((error) => {
              setError(error);
              setIsErrorShown(true);
            });
          } else {
            router.navigate("/(tabs)/shipping");
          }
        })
        .finally(() => {
          dispatch(resetProofOfDelivery());
          setIsCompletingDelivery(false);
        });
  };
  const handleCompletion = () => {
    if (proofOfDeliveryImage === undefined) {
      setCaptureProofOfDeliveryShown(true);
    } else {
      setCompleteDeliveryShown(true);
    }
  };

  useEffect(() => {
    setButtonLabel(
      proofOfDeliveryImage === undefined
        ? "Xác nhận giao hàng"
        : "Hoàn thành vận đơn"
    );
  }, [proofOfDeliveryImage]);
  return (
    <>
      <Button
        style={styles.updateStatusButton}
        leftIcon={<Icon as={Ionicons} name="checkmark-circle-outline" />}
        backgroundColor={Colors.ewmh.background}
        size="sm"
        onPress={handleCompletion}
      >
        <Text fontWeight="bold" style={styles.orderButtonText} fontSize="sm">
          {buttonLabel}
        </Text>
      </Button>
      <CustomAlertDialogV2
        header="Chú ý"
        body="Xin vui lòng chụp lại bằng chứng giao hàng để tiếp tục."
        isShown={captureProofOfDeliveryShown}
        hideModal={() => setCaptureProofOfDeliveryShown(false)}
        proceedText="Chấp nhận"
        cancelText="Từ chối"
        action={goToCaptureProofOfDelivery}
      />
      <CustomAlertDialogV2
        header="Chú ý"
        body="Bạn có chắc chắn muốn hoàn thành vận đơn này?"
        isShown={completeDeliveryShown}
        hideModal={() => setCompleteDeliveryShown(false)}
        proceedText="Có"
        cancelText="Không"
        action={completeDelivery}
        isActionExecuting={isCompletingDelivery}
      />
      <CustomAlertDialogV2
        header="Chú ý"
        body={error}
        isShown={isErrorShown}
        hideModal={() => setIsErrorShown(false)}
        proceedText="Chấp nhận"
      />
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
  requestDetail: {
    height: "50%",
    marginTop: 2,
    flexDirection: "column",
  },
  updateStatusButton: {
    flexDirection: "row",
    height:
      SCREEN_HEIGHT < MOBILE_HEIGHT
        ? SCREEN_HEIGHT * 0.06
        : SCREEN_HEIGHT * 0.05,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 5,
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
