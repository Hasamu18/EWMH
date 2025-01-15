import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useFakeLoading } from "@/utils/utils";
import EmptyState from "@/components/custom_components/EmptyState";
import Pdf from "react-native-pdf";

const PdfViewer = () => {
  const params = useLocalSearchParams();
  const requestId = params.fileUrl as string;
  console.log("Request Id in PDF:", requestId)
  const navigation = useNavigation();
  // Remove the 'RQ_' prefix to generate the correct ID
  const idWithoutPrefix = requestId.replace("RQ_", "");
  const evidenceUrl = `https://firebasestorage.googleapis.com/v0/b/sep490-8888.appspot.com/o/RequestDetails%2FRQPRE_${idWithoutPrefix}?alt=media`;

  console.log("Generated PDF URL:", evidenceUrl);
  const [fakeLoading, setFakeLoading] = useState(true);

  useFakeLoading(setFakeLoading);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Hình ảnh trước khi sửa",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
    });
  }, [navigation]);

  if (fakeLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  if (!requestId) {
    return (
      <View>
        <EmptyState title="Không có PDF" subtitle="Không tìm PDF mà bạn cần" />
      </View>
    );
  }



  return (
    <View style={{ flex: 1 }}>
        <Pdf
        source={{ uri: evidenceUrl }}
        trustAllCerts={false}
        style={styles.pdf}

        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1, // Make PDF fill the screen
    width: '100%',
    height: '100%', // Ensure the PDF view fills the container
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
  },
});

export default PdfViewer;
