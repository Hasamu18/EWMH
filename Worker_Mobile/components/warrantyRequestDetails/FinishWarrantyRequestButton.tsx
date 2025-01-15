import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { COMPLETED } from "@/constants/Request";
import { RequestDetails } from "@/models/RequestDetails";
import { setFinishWarrantyRequestModalState } from "@/redux/components/finishWarrantyRequestModalSlice";
import { IsLeadWorker } from "@/utils/WorkerUtils";
import { Ionicons } from "@expo/vector-icons";
import { Button, Icon, Text } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

interface FinishWarrantyRequestButtonProps {
  requestDetails: RequestDetails;
}
export default function FinishWarrantyRequestButton({
  requestDetails,
}: FinishWarrantyRequestButtonProps) {
  const dispatch = useDispatch();
  const [isLeadWorker, setIsLeadWorker] = useState<boolean>(false);
  const openModal = () => {
    dispatch(setFinishWarrantyRequestModalState(true));
  };

  useEffect(() => {
    IsLeadWorker(requestDetails).then((result) => {
      setIsLeadWorker(result);
    });
  }, []);
  return (
    <>
      {requestDetails.status === COMPLETED ||
      isLeadWorker === false ||
      !requestDetails.preRepairEvidenceUrl ||
      !requestDetails.postRepairEvidenceUrl ? null : (
        <Button
          style={styles.addProduct}
          leftIcon={<Icon as={Ionicons} name="checkmark-circle-outline" />}
          size="sm"
          onPress={openModal}
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
  addProduct: {
    flexDirection: "row",
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
  },
  orderButtonText: {
    color: Colors.ewmh.foreground,
  },
});
