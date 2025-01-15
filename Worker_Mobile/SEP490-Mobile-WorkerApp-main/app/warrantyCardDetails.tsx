import {
  API_WarrantyRequests_AddCardToRequest,
  API_WarrantyRequests_GetCardById,
} from "@/api/warrantyRequests";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { CUD_SUCCESS } from "@/constants/HttpCodes";
import { AddWarrantyCardRequest } from "@/models/AddWarrantyCardRequest";
import { WarrantyCardDetailsModel } from "@/models/WarrantyCardDetailsModel";
import { setIsLoading } from "@/redux/screens/homeScreenSlice";
import { RootState } from "@/redux/store";
import {
  ConvertToOtherDateStringFormat,
  DateToStringModes,
} from "@/utils/DateUtils";
import { router, useLocalSearchParams } from "expo-router";
import { Button, HStack, Image, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function WarrantyCardDetailsScreen() {
  const { warrantyCardId } = useLocalSearchParams();
  const [warrantyCardDetails, setWarrantyCardDetails] =
    useState<WarrantyCardDetailsModel>();
  useEffect(() => {
    API_WarrantyRequests_GetCardById(warrantyCardId as string).then(
      (warrantyCardDetails) => {
        setWarrantyCardDetails(warrantyCardDetails);
      }
    );
  }, []);
  return (
    <>
      {warrantyCardDetails == null ? (
        <FullScreenSpinner />
      ) : (
        <View style={styles.container}>
          <ProductImage image={warrantyCardDetails.productImageUrl} />
          <Details warrantyCardDetails={warrantyCardDetails} />
          <AddToWarrantyRequestButton
            warrantyCardId={warrantyCardId as string}
          />
          {/* <PurchaseSection productId={warrantyCardDetails as string} /> */}
        </View>
      )}
    </>
  );
}
interface ProductImageProps {
  image: string;
}
function ProductImage({ image }: ProductImageProps) {
  return (
    <Image
      source={{
        uri: image,
      }}
      style={styles.image}
      size="xl"
      alt="Product Image"
    />
  );
}
interface DetailsProps {
  warrantyCardDetails: WarrantyCardDetailsModel;
}
function Details({ warrantyCardDetails }: DetailsProps) {
  return (
    <View style={styles.details}>
      <ProductDetails warrantyCardDetails={warrantyCardDetails} />
      <CustomerDetails warrantyCardDetails={warrantyCardDetails} />
      <Text fontSize="lg" fontWeight="bold" noOfLines={1} marginY="2"></Text>
    </View>
  );
}
function ProductDetails({ warrantyCardDetails }: DetailsProps) {
  return (
    <VStack>
      <Text
        fontSize="lg"
        fontWeight="bold"
        marginTop="5"
        marginBottom="3"
        color={Colors.ewmh.background}
      >
        Thông tin thẻ bảo hành
      </Text>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="lg">Mã thẻ</Text>
        <Text fontSize="lg" fontWeight="bold">
          {warrantyCardDetails.warrantyCardId}
        </Text>
      </HStack>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="lg">Tên sản phẩm</Text>
        <Text fontSize="lg" fontWeight="bold">
          {warrantyCardDetails.productName}
        </Text>
      </HStack>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="lg">Ngày bắt đầu</Text>
        <Text fontSize="lg" fontWeight="bold">
          {ConvertToOtherDateStringFormat(
            warrantyCardDetails.startDate,
            DateToStringModes.DMY
          )}
        </Text>
      </HStack>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="lg">Ngày kết thúc</Text>
        <Text fontSize="lg" fontWeight="bold">
          {ConvertToOtherDateStringFormat(
            warrantyCardDetails.expireDate,
            DateToStringModes.DMY
          )}
        </Text>
      </HStack>
    </VStack>
  );
}

function CustomerDetails({ warrantyCardDetails }: DetailsProps) {
  return (
    <VStack>
      <Text
        fontSize="lg"
        fontWeight="bold"
        marginTop="5"
        marginBottom="3"
        color={Colors.ewmh.background}
      >
        Thông tin khách hàng
      </Text>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="lg">Họ và tên</Text>
        <Text fontSize="lg" fontWeight="bold">
          {warrantyCardDetails.customerName}
        </Text>
      </HStack>
    </VStack>
  );
}
interface AddToWarrantyRequestButtonProps {
  warrantyCardId: string;
}
function AddToWarrantyRequestButton({
  warrantyCardId,
}: AddToWarrantyRequestButtonProps) {
  const [isAddingWarrantyCard, setIsAddingWarrantyCard] = useState(false);
  const dispatch = useDispatch();
  const requestId = useSelector(
    (state: RootState) => state.addToWarranyRequestButton.requestId
  );
  const buildRequest = (): AddWarrantyCardRequest => {
    return {
      requestId: requestId,
      warrantyCardIdList: [warrantyCardId],
    };
  };
  const addToWarrantyRequest = () => {
    setIsAddingWarrantyCard(true);
    const request = buildRequest();
    console.log("add warranty card request:", request);
    API_WarrantyRequests_AddCardToRequest(request)
      .then((response) => {
        if (response.status === CUD_SUCCESS) {
          dispatch(setIsLoading(true)); //forces the WarrantyRequestDetails screen to reload
          router.navigate({
            pathname: "/(tabs)/home",
            params: { requestId: requestId },
          });
        } else {
          response.text().then((txt) => {
            console.log(txt);
          });
        }
      })
      .catch((error) => {
        console.log("Đã có lỗi xảy ra: ", error);
      })
      .finally(() => {
        setIsAddingWarrantyCard(false);
      });
  };

  return (
    <View style={styles.addButtonContainer}>
      {isAddingWarrantyCard ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button style={styles.addButton} onPress={addToWarrantyRequest}>
          <Text fontWeight="bold" color={Colors.ewmh.foreground} fontSize="sm">
            Thêm vào yêu cầu bảo hành
          </Text>
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
  },
  image: {
    flex: 3,
    width: "100%",
  },
  details: {
    flex: 5,
    marginVertical: 20,
  },
  descriptionContainer: {
    flex: 1,
    marginVertical: 20,
  },
  inputSpinner: {
    flex: 5,
  },
  addButtonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.06,
    width: "100%",
  },
  purchaseSection: {
    justifyContent: "space-between",
  },
  productInfoItem: {
    justifyContent: "space-between",
    marginVertical: 3,
  },
});
