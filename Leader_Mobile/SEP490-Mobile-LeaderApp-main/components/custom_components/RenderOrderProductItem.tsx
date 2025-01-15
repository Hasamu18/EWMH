import { Image, ScrollView, Text, useWindowDimensions, View } from "react-native";
import EmptyState from "./EmptyState";
import { OrderProductDetails } from "@/model/order";
import RenderHTML from "react-native-render-html";

interface RenderOrderProductItemProps {
  details: OrderProductDetails[];
}

const RenderOrderProductItem = ({ details }: RenderOrderProductItemProps) => {
  const { width } = useWindowDimensions();

  if (!details || details.length === 0) {
    return (
      <EmptyState
        title="Không có sản phẩm"
        subtitle="Không tìm thấy sản phẩm nào cần"
      />
    );
  }

  return (
    <ScrollView>
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        {details.map(({ product, orderDetail }) => (
          <View
            key={`${orderDetail.orderId}-${orderDetail.productId}`}
            style={{ width: "100%", marginBottom: 16 }}
            className="bg-[#DBE2EF] rounded-lg shadow-lg"
          >
            <Image
              source={{ uri: product.imageUrl }}
              className="w-full h-32 rounded-md mb-2"
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold mb-1" numberOfLines={1}>
                  {product.name}
                </Text>
              </View>
              <View className="flex-row justify-between items-center my-4">
                <Text className="text-base p-2 border border-black rounded">
                  {orderDetail.quantity} sản phẩm
                </Text>
                <Text className="text-[#3F72AF] text-base">
                  {orderDetail.totalPrice.toLocaleString()} VND
                </Text>
              </View>
              <View>
                <Text className="text-xl font-bold mb-2">Mô tả:</Text>
                <Text className="text-gray-500 mb-1">
                <RenderHTML
                  contentWidth={width} // Account for padding
                  source={{
                    html:
                    product.description ??
                      "<p>Không có dữ liệu</p>",
                  }}
                />
                  {}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RenderOrderProductItem;
