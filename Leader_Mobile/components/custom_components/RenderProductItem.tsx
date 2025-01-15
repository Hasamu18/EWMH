import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Product } from "@/model/product";
import { router } from "expo-router";
import { formatCurrency } from "@/utils/utils";
import EmptyState from "./EmptyState";
import { useGlobalState } from "@/context/GlobalProvider";

interface RenderProductItemProps {
  products: Product[];
  refreshing: boolean;
  onRefresh: () => void;
}

const RenderProductItem = ({
  products,
  onRefresh,
  refreshing,
}: RenderProductItemProps) => {
  const { loading } = useGlobalState();

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="bg-[#DBE2EF] rounded-lg m-1 mb-8 w-[48%] shadow-lg"
      onPress={() => router.push(`/productDetail/${item.productId}`)}
    >
      <Image
        source={{
          uri: `${item.imageUrl}&timestamp=${new Date().getTime()}`,
        }}
        className="w-full h-32 rounded-md mb-2"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-lg font-bold mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          className={`text-gray-500 ${
            item.inOfStock && item.inOfStock < 1
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {item.inOfStock && item.inOfStock < 1
            ? "Hết hàng"
            : `Số lượng: ${item.inOfStock}`}
        </Text>
        <Text className="text-lg text-[#3F72AF]">
          {formatCurrency(item.priceByDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && products.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );
  }

  return (
    <FlatList
      pagingEnabled
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.productId}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        !loading ? (
          <EmptyState
            title="Không có sản phẩm"
            subtitle="Không tìm sản phẩm mà bạn cần"
            onRefresh={onRefresh}
          />
        ) : null
      }
    />
  );
};

export default RenderProductItem;
