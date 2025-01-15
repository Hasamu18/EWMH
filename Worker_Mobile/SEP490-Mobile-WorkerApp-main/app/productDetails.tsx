import { API_Products_GetById } from "@/api/products";
import ReplacementReasonModal from "@/components/productDetails/ReplacementReasonModal";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import Colors from "@/constants/Colors";
import { MOBILE_HEIGHT, SCREEN_HEIGHT } from "@/constants/Device";
import { ProductDetails } from "@/models/ProductDetails";
import {
  setProductId,
  setProductQuantity,
  setReplacementReasonModalState,
} from "@/redux/components/replacementReasonModalSlice";
import { FormatPriceToVnd } from "@/utils/PriceUtils";
import { useLocalSearchParams } from "expo-router";
import { Button, HStack, Image, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import HTMLView from "react-native-htmlview";
import InputSpinner from "react-native-input-spinner";
import { useDispatch } from "react-redux";
export default function ProductsDetailsScreen() {
  const { productId } = useLocalSearchParams();
  const [productDetails, setProductDetails] = useState<ProductDetails>();
  useEffect(() => {
    API_Products_GetById(productId as string).then((productDetails) => {
      setProductDetails(productDetails);
    });
  }, []);
  return (
    <>
      {productDetails == null ? (
        <FullScreenSpinner />
      ) : (
        <View style={styles.container}>
          <ProductImage image={productDetails.imageUrl} />
          <Details productDetails={productDetails} />
          <PurchaseSection productId={productId as string} />
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
  productDetails: ProductDetails;
}
function Details({ productDetails }: DetailsProps) {
  return (
    <View style={styles.details}>
      <Text fontWeight="bold" fontSize="lg">
        {productDetails.name}
      </Text>

      <Text
        fontSize="lg"
        fontWeight="bold"
        noOfLines={1}
        color={Colors.ewmh.background}
      >
        {FormatPriceToVnd(productDetails.priceByDate)}
      </Text>
      <Text fontSize="lg" fontWeight="bold" noOfLines={1} marginY="2">
        Bảo hành: {productDetails.warantyMonths} tháng
      </Text>
      <Description productDetails={productDetails} />
    </View>
  );
}

function Description({ productDetails }: DetailsProps) {
  return (
    <View style={styles.descriptionContainer}>
      <Text fontSize="lg" fontWeight="bold">
        Mô tả sản phẩm
      </Text>
      <ScrollView>
        <HTMLView
          value={`<wrapper>${productDetails.description}</wrapper>`}
          stylesheet={htmlViewStyles}
        />
      </ScrollView>
    </View>
  );
}
interface PurchaseSectionProps {
  productId: string;
}
function PurchaseSection({ productId }: PurchaseSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const openReplacementReasonModal = () => {
    dispatch(setProductId(productId));
    dispatch(setProductQuantity(quantity));
    dispatch(setReplacementReasonModalState(true));
  };

  return (
    <HStack style={styles.purchaseSection}>
      <InputSpinner
        max={10}
        min={1}
        step={1}
        colorMax={Colors.ewmh.danger}
        color={Colors.ewmh.background}
        value={quantity}
        width={150}
        fontSize={20}
        onChange={(num) => setQuantity(num as number)}
      />
      <Button style={styles.addToCart} onPress={openReplacementReasonModal}>
        <Text
          fontWeight="bold"
          color={Colors.ewmh.foreground}
          fontSize="sm"
          textAlign="center"
        >
          Thêm vào yêu cầu sửa chữa
        </Text>
      </Button>
      <ReplacementReasonModal />
    </HStack>
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
  addToCart: {
    flex: 5,
    backgroundColor: Colors.ewmh.background,
    height:
      SCREEN_HEIGHT < MOBILE_HEIGHT
        ? SCREEN_HEIGHT * 0.08
        : SCREEN_HEIGHT * 0.06,
    marginLeft: 10,
  },
  purchaseSection: {
    justifyContent: "space-between",
  },
});

const htmlViewStyles = StyleSheet.create({
  p: {
    fontWeight: "300",
    fontSize: 17,
  },
  strong: {
    fontSize: 17,
    fontWeight: "bold",
  },
  wrapper: {
    fontSize: 17,
    lineHeight: SCREEN_HEIGHT * 0.03,
  },
});
