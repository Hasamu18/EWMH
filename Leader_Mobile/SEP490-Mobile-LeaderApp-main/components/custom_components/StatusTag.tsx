import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface StatusTagProps {
  status: string;
  size: 'big' | 'small'; 
  containerStyle?: string;
  onPress?: () => void; // Add onPress prop
}

const TagColor = [
  {
    Status: "Yêu Cầu Mới",
    Color: "#DBE2EF",
  },
  {
    Status: "Đang Thực Hiện",
    Color: "#FFD700", 
  },
  {
    Status: "Hoàn Thành",
    Color: "#32CD32", 
  },
  {
    Status: "Đã Hủy",
    Color: "#FF4500", 
  },
  {
    Status: "Chờ Kí",
    Color: "#DBE2EF",
  },
  {
    Status: "Đã Duyệt",
    Color: "#32CD32", 
  },
  {
    Status: "Hết Hạn",
    Color: "#FF4500", 
  },
  {
    Status: "Sửa Chữa",
    Color: "#FFEB3B"
  },
  {
    Status: "Bảo Hành",
    Color: "#2196F3"
  },
  {
    Status: "Đơn Hàng Mới",
    Color: "#DBE2EF",
  },
  {
    Status: "Đã Tiếp Nhận",
    Color: "#FF7A00", 
  },
  {
    Status: "Đang Giao Hàng",
    Color: "#FFD700", 
  },
  {
    Status: "Đã Hoàn Thành",
    Color: "#32CD32", 
  },
  {
    Status: "Trì Hoãn",
    Color: "#FF4500", 
  },
];

const StatusTag = ({ status, size, containerStyle, onPress }: StatusTagProps) => {
  const statusColor = TagColor.find(tag => tag.Status === status)?.Color || "#DBE2EF"; 

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}> 
      {size === 'big' ? (
        <View 
          className={`rounded-full ${containerStyle}`} 
          style={{ backgroundColor: statusColor, alignSelf: 'flex-start' }}
        >
          <Text className="text-base font-bold px-2 py-1">
            {status}
          </Text>
        </View>
      ) : (
        <View 
          className="rounded-full" 
          style={{ backgroundColor: statusColor, alignSelf: 'flex-start' }}
        >
          <Text className="text-[12px] px-2">
            {status}
          </Text>
        </View>
      )}
    </TouchableOpacity>
    // <></>
  );
};

export default StatusTag;
