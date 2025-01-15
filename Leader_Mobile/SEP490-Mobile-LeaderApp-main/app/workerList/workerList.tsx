import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import RenderWorkerItem from "@/components/custom_components/RenderWorkerItem";
import { useWorker } from "@/hooks/useWorker";
import { useGlobalState } from "@/context/GlobalProvider";
import EmptyState from "@/components/custom_components/EmptyUserList";

const WorkerList = () => {
  const { busyWorker, freeWorker, handleGetWorker } = useWorker();
  const navigation = useNavigation();
  const { loading, setLoading } = useGlobalState();
  const [workerType, setWorkerType] = useState<"freeWorker" | "busyWorker">(
    "freeWorker"
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Danh sách nhân viên",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
    });
  }, [navigation]);

  const fetchWorker = useCallback(async () => {
    setLoading(true);
    if (workerType === "freeWorker") {
      await handleGetWorker(true);
    } else {
      await handleGetWorker(false);
    }
    setLoading(false);
  }, [workerType]);

  useFocusEffect(
    useCallback(() => {
      fetchWorker();
    }, [workerType])
  );

  useEffect(() => {
    fetchWorker();
  }, [workerType]);

  const onRefresh = async () => {
    setLoading(true);
    await fetchWorker();
    setLoading(false);
  };

  const data =
    workerType === "freeWorker"
      ? freeWorker
      : busyWorker;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  const isEmpty = !data || data.length === 0;

  return (
    <SafeAreaView className="h-full w-full">
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => setWorkerType("freeWorker")}
          className="w-[50%] py-3"
          style={{
            backgroundColor: workerType === "freeWorker" ? "#32CD32" : "#CCCCCC",
          }}
        >
          <Text className="text-xl text-center font-bold" style={{ color: workerType === "freeWorker" ? "white" : "black" }}>
            Nhân Viên Rảnh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setWorkerType("busyWorker")}
          className="w-[50%] py-3"
          style={{
            backgroundColor: workerType === "busyWorker" ? "#FF4500" : "#CCCCCC",
          }}
        >
          <Text className="text-xl text-center font-bold" style={{ color: workerType === "busyWorker" ? "white" : "black" }}>
            Nhân Viên Bận
          </Text>
        </TouchableOpacity>
      </View>
      {isEmpty ? (
        <View className="flex-1 justify-center items-center">
          <EmptyState
            title="Không có nhân viên"
            subtitle="Vui lòng kiểm tra lại sau."
            onRefresh={onRefresh}
          />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.workerId + index}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <RenderWorkerItem
                workers={[item]}
                refreshing={loading}
                onRefresh={onRefresh}
              />
            </View>
          )}
          onRefresh={onRefresh}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

export default WorkerList;
