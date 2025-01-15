import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useGlobalState } from "@/context/GlobalProvider";
import { Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Timeline from "./CustomTimeline";
import { getTimelineData } from "@/utils/utils";
import CustomButton from "./CustomButton";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import CancelRequestModal from "./CancelRequestModal";
import PreRepairEvidenceModal from "./PreRepairEvidenceModal";

interface ProgressSheetProps {
  status: string;
  report: string;
  id: string;
  fileUrl: string | null;
  image: string | null;
}

const ProgressSheet = ({
  status,
  report,
  id,
  fileUrl,
  image,
}: ProgressSheetProps) => {
  const { isSheetOpen, setIsSheetOpen, loading } = useGlobalState();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);
  const [isEvidenceModalVisible, setIsEvidenceModalVisible] = useState(false);

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

  useEffect(() => {
    if (isSheetOpen) {
      bottomSheetRef.current?.snapToIndex(2);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isSheetOpen]);

  const handleClose = () => {
    setIsSheetOpen(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => setIsSheetOpen(false);
    }, [setIsSheetOpen])
  );

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleClose}
        index={-1}
      >
        <BottomSheetView>
          <View className="p-4">
            <Text className="text-lg font-bold">Trạng thái yêu cầu</Text>

            <Timeline
              report={report}
              requestId={id}
              data={getTimelineData(status)}
              fileUrl={fileUrl}
              status={status}
            />
            {status === "Yêu Cầu Mới" ? (
              <>
                {/* <CustomButton
                  title="Chỉnh sửa yêu cầu"
                  icon={<MaterialIcons name="edit" size={24} color="white" />}
                  handlePress={() => router.push(`/createRequest/${id}`)}
                /> */}
                <CustomButton
                  title="Huỷ yêu cầu"
                  icon={
                    <MaterialCommunityIcons
                      name="book-cancel-outline"
                      size={30}
                      color="white"
                    />
                  }
                  isLoading={loading}
                  handlePress={() => setIsCancelModalVisible(true)}
                  containerStyles="my-5"
                />
              </>
            ) : null}
            {status === "Đang Thực Hiện" ||
            status === "Hoàn Thành" ||
            status === "Đã Hủy"  ? (
              <>
                <CustomButton
                  title="Xem hình ảnh trước khi sửa"
                  handlePress={() => {
                    router.push(`/preRequestPdfViewer/${id}`);
                    console.log("Transfering request ID:", id);
                  }}
                  isLoading={
                    image === null
                  }
                  containerStyles="my-4"
                />
              </>
            ) : null}
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Cancel Request Modal */}
      <CancelRequestModal
        visible={isCancelModalVisible}
        onClose={() => setIsCancelModalVisible(false)}
        requestId={id}
      />
      <PreRepairEvidenceModal
        visible={isEvidenceModalVisible}
        onClose={() => setIsEvidenceModalVisible(false)}
        image={image}
      />
    </>
  );
};

export default ProgressSheet;
