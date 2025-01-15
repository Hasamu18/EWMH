import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { Product } from "@/models/Product";
import { FormatPriceToVnd } from "@/utils/PriceUtils";
import { router } from "expo-router";
import { AspectRatio, Box, Image, Text, VStack } from "native-base";
import { Pressable, StyleSheet } from "react-native";

interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const goToProductDetails = () => {
    router.push({
      pathname: "/productDetails",
      params: { productId: product.productId },
    });
  };
  return (
    <Pressable onPress={goToProductDetails}>
      <Box
        width={SCREEN_WIDTH * 0.45}
        height={SCREEN_HEIGHT * 0.3}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        backgroundColor={Colors.ewmh.background2}
        marginRight={2}
      >
        <Box>
          <AspectRatio w="100%">
            <Image
              source={{
                uri: product.imageUrl,
              }}
              alt="image"
            />
          </AspectRatio>
        </Box>

        <VStack space={2} style={styles.productDetails}>
          <Text
            fontSize="md"
            fontWeight="bold"
            noOfLines={2}
            style={{ flexGrow: 1 }}
          >
            {product.name}
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            noOfLines={1}
            style={styles.price}
          >
            {FormatPriceToVnd(product.priceByDate)}
          </Text>
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
    padding: 10,
  },
  price: {
    color: Colors.ewmh.background,
  },
});
