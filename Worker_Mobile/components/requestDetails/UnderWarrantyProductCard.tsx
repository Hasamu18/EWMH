import Colors from "@/constants/Colors";
import { Product } from "@/models/Product";
import { Box, HStack, Image, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";

interface UnderWarrantyProductCardProps {
  product: Product;
}
export default function UnderWarrantyProductCard({
  product,
}: UnderWarrantyProductCardProps) {
  return (
    <Box>
      <HStack
        style={styles.container}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
      >
        <Box style={styles.productImage}>
          <Image
            source={{
              uri: product.imageUrl,
            }}
            w="100%"
            h="100%"
            alt="image"
          />
        </Box>

        <VStack space={3} style={styles.productDetails}>
          <Text fontSize="md" fontWeight="bold">
            {product.name}
          </Text>
          <Text fontSize="md" fontWeight="bold" color={Colors.ewmh.background}>
            Còn 29 ngày
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    flex: 1,
  },
  productDetails: {
    flexDirection: "column",
    padding: 10,
    flex: 2,
  },
  productImage: {
    width: 20,
    flex: 1,
  },
});
