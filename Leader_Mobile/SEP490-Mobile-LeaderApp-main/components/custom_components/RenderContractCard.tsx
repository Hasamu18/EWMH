import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import { Contract } from "@/model/contract";
import { formatCurrency, formatDate } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import EmptyState from "./EmptyState";

interface ContractProps {
  contract: Contract[];
  refreshing: boolean;
  onRefresh: () => void;
}

const RenderContractCard = ({
  contract,
  refreshing,
  onRefresh,
}: ContractProps) => {
  const renderItem = ({ item }: { item: Contract }) => (
    <TouchableOpacity
      className=" m-3 p-4 rounded-lg border border-black"
      onPress={() => router.push(`/contractDetail/${item.contractId}`)}
    >
      <View className="flex-row items-center mb-4">
        <Image
          source={{
            uri: `${
              item?.servicePackage?.imageUrl
            }&timestamp=${new Date().getTime()}`,
          }}
          className="w-[50px] h-[50px] mr-2 rounded-full"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-lg font-semibold"
          >
            {item?.servicePackage?.name}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-lg font-semibold"
          >
            {formatCurrency(item?.servicePackage?.price)}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center mb-4">
        {item?.customer?.avatarUrl ? (
          <Image
            source={{ uri: item?.customer?.avatarUrl }}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <FontAwesome name="user-circle" size={64} color="black" />
        )}
        <View>
          <Text className="ml-4 text-lg font-bold">
            {item?.customer?.fullName}
          </Text>
          <Text className="ml-4 font-bold">
            {item?.customer?.phoneNumber}
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between items-center p-5 bg-[#DBE2EF] rounded-xl">
        <Text className="text-sm">Ngày đăng kí:</Text>
        <Text className="text-sm">{formatDate(item?.purchaseTime)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={contract}
      renderItem={renderItem}
      keyExtractor={(item) => item.contractId}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center">
            <Text className="text-center text-gray-500 my-5">
              Không có hợp đồng
            </Text>
      </View>
      }
    />
  );
};

export default RenderContractCard;
