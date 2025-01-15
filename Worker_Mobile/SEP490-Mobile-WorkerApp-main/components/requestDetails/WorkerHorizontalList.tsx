import { RequestDetailsWorker } from "@/models/RequestDetails";
import React from "react";
import { FlatList } from "react-native";
import WorkerCard from "./WorkerCard";

interface WorkerHorizontalListProps {
  workers: RequestDetailsWorker[];
}
export default function WorkerHorizontalList({
  workers,
}: WorkerHorizontalListProps) {
  return (
    <FlatList
      horizontal
      data={workers}
      renderItem={(flatListItem) => <WorkerCard worker={flatListItem.item} />}
      keyExtractor={(worker) => worker.workerId}
      showsHorizontalScrollIndicator={false}
    />
  );
}
