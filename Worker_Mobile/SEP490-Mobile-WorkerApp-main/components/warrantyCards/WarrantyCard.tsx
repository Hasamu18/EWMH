import Colors from "@/constants/Colors";
import { MOBILE_HEIGHT, SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { WarrantyCardModel } from "@/models/WarrantyCardModel";
import {
  ConvertToOtherDateStringFormat,
  DateToStringModes,
} from "@/utils/DateUtils";
import { router } from "expo-router";
import { Box, Image, Text, VStack } from "native-base";
import { Pressable, StyleSheet, View } from "react-native";

interface WarrantyCardProps {
  warrantyCard: WarrantyCardModel;
}
export default function WarrantyCard({ warrantyCard }: WarrantyCardProps) {
  const goToProductDetails = () => {
    router.push({
      pathname: "/warrantyCardDetails",
      params: { warrantyCardId: warrantyCard.warrantyCardId },
    });
  };
  return (
    <Pressable onPress={goToProductDetails}>
      <Box
        width={SCREEN_WIDTH * 0.92}
        height={
          SCREEN_HEIGHT < MOBILE_HEIGHT
            ? SCREEN_HEIGHT * 0.45
            : SCREEN_HEIGHT * 0.43
        }
        rounded="lg"
        padding={3}
        backgroundColor={Colors.ewmh.background2}
      >
        <Box>
          <Image
            source={{
              uri: warrantyCard.imageUrl,
            }}
            alt="image"
            w="100%"
            rounded="lg"
            h={SCREEN_HEIGHT * 0.25}
            marginBottom={SCREEN_HEIGHT * 0.01}
          />
        </Box>

        <VStack space={2} style={styles.productDetails}>
          <View style={styles.description}>
            <Text fontSize="md" fontWeight="bold" noOfLines={2}>
              Mã thẻ:
            </Text>
            <Text
              fontSize="md"
              fontWeight="bold"
              noOfLines={2}
              color={Colors.ewmh.background}
            >
              {warrantyCard.warrantyCardId}
            </Text>
          </View>
          <View style={styles.description}>
            <Text fontSize="md" fontWeight="bold" noOfLines={2}>
              Tên sản phẩm:
            </Text>
            <Text
              fontSize="md"
              fontWeight="bold"
              noOfLines={2}
              color={Colors.ewmh.foreground2}
            >
              {warrantyCard.productName}
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
                warrantyCard.startDate,
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
                warrantyCard.expireDate,
                DateToStringModes.DMY
              )}
            </Text>
          </View>
        </VStack>
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  productDetails: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  price: {
    color: Colors.ewmh.background,
  },
  description: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 1.5,
  },
});
