import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import ReportModal from "./ReportModal";

interface TimelineItem {
  title: string;
  description: string;
  color?: string;
}

interface TimelineProps {
  data: TimelineItem[];
  report: string;
  requestId: string;
  fileUrl: string | null;
  status: string
}

const Timeline = ({ data, report, requestId, fileUrl, status}: TimelineProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const renderItem = ({
    item,
    index,
  }: {
    item: TimelineItem;
    index: number;
  }) => (
    <View className="relative flex-row items-start mb-5">
      {index < data.length - 1 && (
        <View className="absolute top-6 left-2 h-[80%] w-0.5 bg-gray-400 -z-1" />
      )}

      <View
        className={`w-5 h-5 rounded-full mr-4 bg-[${
          item.color ? item.color : `#2196F3`
        }]`}
        style={{ backgroundColor: item.color || "#2196F3" }}
      />

      <View className="flex-1 pl-2">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          {item.title}
        </Text>
        <Text
          className={`text-sm ${
            item.description === "Xem lí do hủy" || item.description === "Xem báo cáo" || item.description === "Xem báo cáo & nghiệm thu"
              ? "text-blue-500 underline"
              : "text-gray-600"
          }`}
          {...(item.description === "Xem lí do hủy"|| item.description === "Xem báo cáo" || item.description === "Xem báo cáo & nghiệm thu"
            ? { onPress: () => handleOpenModal() }
            : null)}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );

  const handleOpenModal = () => {
    setModalVisible(true); // Open modal
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close modal
  };

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
      />
      <ReportModal
        onClose={handleCloseModal}
        visible={isModalVisible}
        requestId={requestId}
        report={report}
        fileUrl={fileUrl}
        status={status}
      />
    </>
  );
};

export default Timeline;
