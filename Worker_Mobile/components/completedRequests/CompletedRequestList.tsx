import { COMPLETED } from "@/constants/Request";
import { ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { Request } from "@/models/Request";
import CompletedRequestCard from "../completedRequestDetails/CompletedRequestCard";
import EmptyList from "../shared/EmptyList";

interface CompletedRequestListProps {
  requests: Request[];
}

export default function CompletedRequestList({
  requests,
}: CompletedRequestListProps) {
  const [completedRequests, setCompletedRequests] = useState<Request[]>();
  useEffect(() => {
    const filteredRequests = requests
      .filter((request) => request.status === COMPLETED)
      .sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
      );
    setCompletedRequests(filteredRequests);
  }, []);
  return (
    <>
      {completedRequests === null ||
      completedRequests === undefined ||
      completedRequests?.length === 0 ? (
        <View style={{ marginVertical: SCREEN_HEIGHT * 0.02 }}>
          <EmptyList />
        </View>
      ) : (
        <>
          <ScrollView w="100%" style={styles.scrollView}>
            {completedRequests.map((request, key) => {
              return <CompletedRequestCard request={request} key={key} />;
            })}
          </ScrollView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: { padding: 20 },
  completedSectionHeader: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: Colors.ewmh.requestStatus.completed,
    color: "white",
    marginVertical: 10,
    alignItems: "center",
  },
});
