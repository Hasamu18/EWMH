import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Request } from "@/model/request";
import {
  formatDate,
  getCategoryRequest,
  getStatusDetails,
} from "@/utils/utils";
import StatusTag from "./StatusTag";
import EmptyState from "./EmptyState";
import { router } from "expo-router";

interface RenderRequestItemProps {
  requests: Request[];
  refreshing: boolean;
  onRefresh: () => void;
  size?: "big" | "small";
}

const RenderRequestItem = ({
  requests,
  onRefresh,
  refreshing,
  size,
}: RenderRequestItemProps) => {
  const renderRequestItem = ({ item }: { item: Request }) => (
    <TouchableOpacity
      className="rounded-lg border border-black p-3 mb-5 "
      onPress={() => router.push(`/requestDetail/${item.get.requestId}`)}
    >
      <Text className="text-md font-semibold mb-1" numberOfLines={1}>
        {item.get.requestId}
      </Text>
      <View className="flex-row justify-between my-3">
        <StatusTag
          status={getCategoryRequest(item.get.categoryRequest)}
          size="small"
        />
        <StatusTag status={getStatusDetails(item.get.status)} size="small" />
      </View>
      <View className="flex flex-row justify-between ">
        <View>
          <Text className="text-sm text-gray-500 mb-3">Căn hộ:</Text>
          <Text className="text-sm text-gray-500">Ngày yêu cầu: </Text>
        </View>
        <View>
          <Text className="text-sm text-gray-500 text-right mb-3">
            {item.get.roomId}
          </Text>
          <Text className="text-sm text-gray-500 text-right">
            {formatDate(item.get.start)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={requests}
      renderItem={renderRequestItem}
      keyExtractor={(item) => item.get.requestId}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        requests.length === 0 ? (
          size === "big" ? (
            <View className="flex-1 justify-center items-center">
              <EmptyState
                title="Không có yêu cầu"
                subtitle="Không tìm yêu cầu mà bạn cần"
                onRefresh={onRefresh}
              />
            </View>
          ) : (
            <Text className="text-center text-gray-500 my-5">
              Không có yêu cầu
            </Text>
          )
        ) : null
      }
    />
  );
};

export default RenderRequestItem;
