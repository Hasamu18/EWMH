import { IN_PROGRESS, NEW_REQUEST } from "@/constants/Request";
import { Box, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";

import Colors from "@/constants/Colors";
import { Request } from "@/models/Request";
import FullScreenSpinner from "../shared/FullScreenSpinner";
import RequestCard from "./RequestCard";

interface WarrantyRequestAccordionsProps {
  warrantyRequests: Request[];
}
export default function WarrantyRequestAccordions({
  warrantyRequests,
}: WarrantyRequestAccordionsProps) {
  const [activeSection, setActiveSection] = useState<string | null>(
    "inProgressRequests"
  );

  const toggleSection = (section: string) => {
    setActiveSection((prevSection) =>
      prevSection === section ? null : section
    );
  };
  return (
    <ScrollView style={styles.scrollView}>
      <Box>
        <TouchableOpacity onPress={() => toggleSection("inProgressRequests")}>
          <Text style={styles.sectionHeader}>Đang thực hiện</Text>
        </TouchableOpacity>
        <Collapsible collapsed={activeSection !== "inProgressRequests"}>
          <InProgressRequests warrantyRequests={warrantyRequests} />
        </Collapsible>

        <TouchableOpacity onPress={() => toggleSection("newRequests")}>
          <Text style={styles.sectionHeader}>Yêu cầu mới</Text>
        </TouchableOpacity>
        <Collapsible collapsed={activeSection !== "newRequests"}>
          <NewRequests warrantyRequests={warrantyRequests} />
        </Collapsible>
      </Box>
    </ScrollView>
  );
}

function InProgressRequests({
  warrantyRequests,
}: WarrantyRequestAccordionsProps) {
  const [inProgressRequests, setInProgressRequests] = useState<Request[]>();
  useEffect(() => {
    const filteredRequests = warrantyRequests.filter(
      (request) => request.status === IN_PROGRESS
    );
    setInProgressRequests(filteredRequests);
  }, []);
  return (
    <>
      {inProgressRequests === null || inProgressRequests === undefined ? (
        <FullScreenSpinner />
      ) : (
        <ScrollView w="100%" style={styles.scrollView}>
          <VStack w="100%">
            {inProgressRequests.map((request, key) => {
              return <RequestCard request={request} key={key} />;
            })}
          </VStack>
        </ScrollView>
      )}
    </>
  );
}
function NewRequests({ warrantyRequests }: WarrantyRequestAccordionsProps) {
  const [newRequests, setNewRequests] = useState<Request[]>();
  useEffect(() => {
    const filteredRequests = warrantyRequests.filter(
      (request) => request.status === NEW_REQUEST
    );
    setNewRequests(filteredRequests);
  }, []);
  return (
    <>
      {newRequests === null || newRequests === undefined ? (
        <FullScreenSpinner />
      ) : (
        <ScrollView w="100%" style={styles.scrollView}>
          <VStack w="100%">
            {newRequests.map((request, key) => {
              return <RequestCard request={request} key={key} />;
            })}
          </VStack>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.ewmh.background,
    color: "white",
    marginVertical: 10,
  },
});
