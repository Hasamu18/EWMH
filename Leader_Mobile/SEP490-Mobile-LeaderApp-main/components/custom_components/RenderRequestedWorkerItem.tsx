import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import EmptyState from "./EmptyState";
import { Worker } from "@/model/worker";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import { handlePhonePress } from "@/utils/utils";

interface RenderRequestedWorkerItemProps {
  workers: Worker[];
}

const RenderRequestedWorkerItem = ({
  workers,
}: RenderRequestedWorkerItemProps) => {
  if (!workers || workers.length === 0) {
    return (
      <EmptyState
        title="Không có nhân viên"
        subtitle="Không tìm thấy nhân viên mà bạn cần"
      />
    );
  }

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: workers.length % 2 === 1 ? "center" : "space-between",
        }}
      >
        {workers.map((item) => (
          <View
            key={item.workerInfo.accountId}
            style={{ width: "47.7%", marginBottom: 16 }}
            className="bg-[#DBE2EF] mx-1 rounded-lg shadow-lg"
          >
            <Image
              source={{ uri: `${
                item?.workerInfo.avatarUrl
              }&timestamp=${new Date().getTime()}` }}
              className="w-full h-32 rounded-md mb-2"
              resizeMode="cover"
            />
            {item.isLead === true ? (
              <View className="bg-amber-800 w-14 p-2 rounded-l-xl absolute top-5 right-0">
                <Fontisto name="star" size={24} color="yellow" />
              </View>
            ) : (
              <></>
            )}
            <View className="p-4">
              <Text className="text-lg text-center font-bold mb-1" numberOfLines={1}>
                {item?.workerInfo.fullName}
              </Text>
              <View className="flex-row justify-evenly items-center">
                <Text className="text-gray-500">{item?.workerInfo.phoneNumber}</Text>
                <TouchableOpacity
                  onPress={() => handlePhonePress(item.workerInfo.phoneNumber)}
                  className="bg-blue-500 rounded-md p-2 flex-row justify-center items-center"
                >
                  <FontAwesome name="phone" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RenderRequestedWorkerItem;
