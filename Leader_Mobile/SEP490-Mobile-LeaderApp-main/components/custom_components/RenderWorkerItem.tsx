import { Text, Image, FlatList, RefreshControl, View } from "react-native";
import React from "react";
import { Worker } from "@/model/worker";
import EmptyState from "./EmptyUserList";
import { AntDesign, Feather } from "@expo/vector-icons";

interface RenderWorkerItemProps {
  workers: Worker[];
  refreshing: boolean;
  onRefresh: () => void;
}

const RenderWorkerItem = ({
  workers,
  onRefresh,
  refreshing,
}: RenderWorkerItemProps) => {
  const renderItem = ({ item }: { item: Worker }) => (
    <View className=" bg-[#DBE2EF] rounded-xl mx-2 my-4 p-4 flex-row">
      <Image
        source={{
          uri: `${
            item.workerInfo.avatarUrl
          }&timestamp=${new Date().getTime()}`,
        }}
        className="w-[70px] h-[70px] rounded-full mr-3"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="font-bold text-xl mb-3">{item.workerInfo.fullName}</Text>
        <Text className="text-base text-gray-500 mb-3">
          <AntDesign name="mail" size={19} color="black" />{"  "}{item.workerInfo.email}
        </Text>
        <Text className="text-base text-gray-500 mb-3">
          <Feather name="phone-call" size={19} color="black" />{" "}
          {" "}{item.workerInfo.phoneNumber}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={workers}
      renderItem={renderItem}
      keyExtractor={(item) => item.workerInfo.accountId} // Use AccountId as the unique key
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center">
            <Text className="text-center text-gray-500 my-5">
              Không có nhân viên
            </Text>
      </View>
      }
    />
  );
};

export default RenderWorkerItem;