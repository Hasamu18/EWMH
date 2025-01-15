import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Product } from "@/model/product";
import EmptyState from "@/components/custom_components/EmptyState";
import { useProduct } from "@/hooks/useProduct";
import RenderHTML from "react-native-render-html";

const ProductDetail = () => {
  const { products } = useProduct();
  const params = useLocalSearchParams();
  const ProductId = params.ProductId;
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Chi tiết sản phẩm",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
    });
  }, [navigation]);

  const product = products.find(
    (item: Product) => item.productId === ProductId
  );

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center">
        <EmptyState
          title="Không có sản phẩm"
          subtitle="Không tìm sản phẩm mà bạn cần"
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-cente">
      <ScrollView>
        <View className=" mb-10 w-full flex justify-center items-center">
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-64"
            resizeMode="cover"
          />
        </View>
        <View className="px-3">
          <Text className="text-2xl font-bold mb-4">
            {product.name || "Tên sản phẩm không có"}
          </Text>
          <View className="flex-row justify-between w-[100%] items-end">
            <Text className="text-lg text-[#3F72AF] mb-4">
              {product.priceByDate.toLocaleString()}.000 VND
            </Text>
            <Text
              className={`text-base mb-4 ${
                product.inOfStock && product.inOfStock < 1 ? "text-red-500" : "text-green-500"
              }`}
            >
              {product.inOfStock && product.inOfStock < 1
                ? "Hết hàng"
                : `Còn hàng: ${product.inOfStock}`}
            </Text>
          </View>
          <Text className="underline text-lg font-bold">Mô tả sản phẩm:</Text>
          <View className="w-full">
          <RenderHTML
  contentWidth={width}
  source={{ html: product.description ?? "<p>Mô tả không có</p>" }}
  baseStyle={{
    fontSize: 16, // Adjust the font size
    lineHeight: 24, // Optional: Adjust line height for better readability
    color: "#333", // Optional: Adjust text color if needed
  }}
/>
              </View>
          <Text className="underline text-lg font-bold">
            Bảo hành: {product.warantyMonths || "Không có dữ liệu"} tháng
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
