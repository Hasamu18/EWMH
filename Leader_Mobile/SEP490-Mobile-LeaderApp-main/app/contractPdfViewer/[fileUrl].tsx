import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Pdf from "react-native-pdf";
import { useFakeLoading } from "@/utils/utils";
import EmptyState from "@/components/custom_components/EmptyState";
import IconButton from "@/components/custom_components/IconButton";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useGlobalState } from "@/context/GlobalProvider";
import { Entypo } from "@expo/vector-icons";

const pdfViewer = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { loading, setLoading } = useGlobalState();
  const [fakeLoading, setFakeLoading] = useState(true);

  useFakeLoading(setFakeLoading);
  const fileUrl = params.fileUrl as string;
  const pdfUrl = `https://firebasestorage.googleapis.com/v0/b/sep490-8888.appspot.com/o/Contracts%2F${fileUrl}?alt=media`;
  console.log("pdf link:", pdfUrl);

  const downloadContract = async () => {
    setLoading(true);
    if (!fileUrl) {
      Alert.alert("Lỗi", "Không có file để tải xuống");
      return;
    }

    try {
      Alert.alert("Đang tải xuống", "Tệp đang xuống...");
      const fileUri = `${FileSystem.documentDirectory}${fileUrl}.pdf`;
      const { uri } = await FileSystem.downloadAsync(pdfUrl, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        Alert.alert("Tải xuống thành công", "Tệp đã lưu xuống thành công");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Đã gặp lỗi", "Đã gặp lỗi khi đang tải tệp xuống");
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Hợp đồng",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
      headerRight: () => (
        <View className="w-24 flex-row justify-evenly">
          <IconButton
            icon={<Entypo name="download" size={30} color="white" />}
            handlePress={() => downloadContract()}
          />
        </View>
      ),
    });
  }, [navigation]);

  if (loading || fakeLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }



  if (!fileUrl) {
    return (
      <View>
        <EmptyState title="Không có PDF" subtitle="Không tìm PDF mà bạn cần" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Pdf source={{ uri: pdfUrl }} trustAllCerts={false} style={styles.pdf} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pdf: {
    flex: 1, // Make PDF fill the screen
    width: "100%",
    height: "100%", // Ensure the PDF view fills the container
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    textAlign: "center",
  },
});

export default pdfViewer;
