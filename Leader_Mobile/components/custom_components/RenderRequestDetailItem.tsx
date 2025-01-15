import { RequestDetails } from "@/model/request";
import { Image, ScrollView, Text, View } from "react-native";
import EmptyState from "./EmptyState";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Product } from "@/model/product";

interface RenderRequestDetailItemProps {
  details: Product[];
}

const RenderRequestDetailItem = ({ details }: RenderRequestDetailItemProps) => {
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
        {details.map((item) => (
          <View
            key={item.productId}
            style={{ width: "100%", marginBottom: 16 }}
            className="bg-[#DBE2EF] rounded-lg shadow-lg"
          >
            <Image
              source={{ uri: item.imageUrl }}
              className="w-full h-32 rounded-md mb-2"
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold mb-1" numberOfLines={1}>
                  {item.name}
                </Text>
                {item.isCustomerPaying ? (
                  <AntDesign name="checksquare" size={24} color="black" />
                ) : (
                  <Feather name="square" size={24} color="black" />
                )}
              </View>
              <View className="flex-row justify-between items-center my-4">
                <Text className="text-base p-2 border border-black rounded">
                  {item.quantity} sản phẩm
                </Text>
                <Text className="text-[#3F72AF] text-base">
                  {item.totalPrice} VND
                </Text>
              </View>
              <View className="">
                <Text className="text-xl font-bold mb-2">Lý do:</Text>
                <Text className="text-gray-500 mb-1">{item.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RenderRequestDetailItem;
