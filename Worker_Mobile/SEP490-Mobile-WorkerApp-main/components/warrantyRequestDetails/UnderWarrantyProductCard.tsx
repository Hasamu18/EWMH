import { API_WarrantyRequests_RemoveCardFromRequest } from "@/api/warrantyRequests";
import Colors from "@/constants/Colors";
import { MOBILE_WIDTH, SCREEN_WIDTH } from "@/constants/Device";
import { SUCCESS } from "@/constants/HttpCodes";
import { COMPLETED } from "@/constants/Request";
import { RemoveWarrantyCardRequest } from "@/models/RemoveWarrantyCardRequest";
import { RequestDetails, WarrantyRequest } from "@/models/RequestDetails";
import { setIsLoading } from "@/redux/screens/homeScreenSlice";
import {
  ConvertToOtherDateStringFormat,
  DateToStringModes,
} from "@/utils/DateUtils";
import { IsLeadWorker } from "@/utils/WorkerUtils";

import { Ionicons } from "@expo/vector-icons";
import {
  AspectRatio,
  Box,
  Button,
  Icon,
  Image,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";

interface UnderWarrantyProductCardProps {
  warrantyRequest: WarrantyRequest;
  requestDetails: RequestDetails;
}
export default function UnderWarrantyProductCard({
  warrantyRequest,
  requestDetails,
}: UnderWarrantyProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const requestId = requestDetails.requestId;
  const [isLeadWorker, setIsLeadWorker] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isErrorShown, setIsErrorShown] = useState(false);
  const buildRequest = (): RemoveWarrantyCardRequest => {
    return {
      requestId: requestId,
      warrantyCardId: warrantyRequest.warrantyCardId,
    };
  };
  const removeWarrantyCard = () => {
    setIsDeleting(true);
    const request = buildRequest();
    API_WarrantyRequests_RemoveCardFromRequest(request)
      .then((response) => {
        if (response.status !== SUCCESS) {
          response.text().then((error) => {
            setError(error);
            setIsErrorShown(true);
          });
        } else {
          dispatch(setIsLoading(true)); //forces the Home screen to reload
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  useEffect(() => {
    IsLeadWorker(requestDetails).then((result) => {
      setIsLeadWorker(result);
    });
  }, []);
  return (
    <View style={styles.container}>
      <Box>
        <AspectRatio w="100%">
          <Image
            source={{
              uri: warrantyRequest.productImageUrl,
            }}
            alt="image"
          />
        </AspectRatio>
      </Box>

      <VStack space={2} style={styles.productDetails}>
        <View style={styles.description}>
          <Text fontSize="md" fontWeight="bold" noOfLines={2}>
            Mã thẻ:
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            maxW={
              SCREEN_WIDTH < MOBILE_WIDTH
                ? SCREEN_WIDTH * 0.4
                : SCREEN_WIDTH * 0.5
            }
            textAlign="right"
            color={Colors.ewmh.background}
          >
            {warrantyRequest.warrantyCardId}
          </Text>
        </View>
        <View style={styles.description}>
          <Text fontSize="md" fontWeight="bold">
            Tên sản phẩm:
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            noOfLines={2}
            maxW={
              SCREEN_WIDTH < MOBILE_WIDTH
                ? SCREEN_WIDTH * 0.4
                : SCREEN_WIDTH * 0.5
            }
            textAlign="right"
            color={Colors.ewmh.foreground2}
          >
            {warrantyRequest.productName}
          </Text>
        </View>
        <View style={styles.description}>
          <Text fontSize="md" fontWeight="bold" noOfLines={2}>
            Ngày bắt đầu:
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            noOfLines={2}
            color={Colors.ewmh.background}
          >
            {ConvertToOtherDateStringFormat(
              warrantyRequest.startDate,
              DateToStringModes.DMY
            )}
          </Text>
        </View>
        <View style={styles.description}>
          <Text fontSize="md" fontWeight="bold" noOfLines={2}>
            Ngày kết thúc:
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            noOfLines={2}
            color={Colors.ewmh.danger}
          >
            {ConvertToOtherDateStringFormat(
              warrantyRequest.expireDate,
              DateToStringModes.DMY
            )}
          </Text>
        </View>
        {isDeleting ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : (
          <>
            {isLeadWorker === false ||
            requestDetails.status === COMPLETED ? null : (
              <Button
                backgroundColor={Colors.ewmh.danger1}
                onPress={removeWarrantyCard}
                style={styles.removeButton}
                leftIcon={<Icon as={Ionicons} name="trash-outline" />}
              >
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  color={Colors.ewmh.foreground}
                >
                  Gỡ thẻ bảo hành
                </Text>
              </Button>
            )}
          </>
        )}
        <CustomAlertDialogV2
          isShown={isErrorShown}
          hideModal={() => {
            setIsErrorShown(false);
          }}
          proceedText="Chấp nhận"
          header="Thông báo"
          body={error}
        />
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ewmh.background3,
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
  },
  activityIndicator: {
    alignSelf: "center",
    marginVertical: 10,
  },
  productDetails: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10,
  },
  price: {
    color: Colors.ewmh.background,
  },
  description: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  removeButton: {
    width: "100%",
    marginVertical: 5,
  },
});
