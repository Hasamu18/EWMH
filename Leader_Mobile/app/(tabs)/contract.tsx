import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { View } from "@/components/Themed";
import { useContract } from "@/hooks/useContract";
import { useGlobalState } from "@/context/GlobalProvider";
import EmptyState from "@/components/custom_components/EmptyState";
import RenderContractCard from "@/components/custom_components/RenderContractCard";
import SearchInput from "@/components/custom_components/SearchInput";
import { useFakeLoading } from "@/utils/utils";

const Contract = () => {
  const [collapsedSections, setCollapsedSections] = useState({
    pendingContracts: true,
    validContracts: true,
    expiredContracts: true,
  });

  const {
    handleGetPendingContract,
    handleGetValidContract,
    handleGetExpiredContract,
    setContracts,
    setSearchContractQuery,
    searchContractQuery,
    pendingContracts,
    validContracts,
    expiredContracts,
  } = useContract();
  const { loading, setLoading } = useGlobalState();
  const timeoutRef = useRef<number | null>(null);
  const [fakeLoading, setFakeLoading] = useState(true);
  useFakeLoading(setFakeLoading)

  type Section = "pendingContracts" | "validContracts" | "expiredContracts";

  const fetchAllContracts = useCallback(async () => {
    setLoading(true);
    setContracts([]);
    await handleGetPendingContract();
    await handleGetValidContract();
    await handleGetExpiredContract();
    setLoading(false);
  }, [handleGetPendingContract, handleGetValidContract, handleGetExpiredContract]);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchAllContracts();
    }, 1000) as unknown as number;

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchContractQuery]);

  const onRefresh = async () => {
    setLoading(true);
    await fetchAllContracts();
    setLoading(false);
  };

  const toggleSection = (section: Section) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const sections = useMemo(() => {
    return [
      {
        title: "Hợp Đồng Chờ Kí",
        data: pendingContracts,
        key: "pendingContracts" as Section,
      },
      {
        title: "Hợp Đồng Đã Duyệt",
        data: validContracts,
        key: "validContracts" as Section,
      },
      {
        title: "Hợp Đồng Hết Hạn",
        data: expiredContracts,
        key: "expiredContracts" as Section,
      },
    ];
  }, [pendingContracts, validContracts, expiredContracts]);

  const handleSubmitSearch = async () => {
    await fetchAllContracts();
  };

  const allContractsEmpty =
    !pendingContracts.length &&
    !validContracts.length &&
    !expiredContracts.length;

    if (fakeLoading) {
      return (
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#5F60B9" />
        </SafeAreaView>
      );
    }

  return (
    <SafeAreaView className="w-full h-full">
      <View className="flex flex-row w-full justify-between my-5 px-4">
        <SearchInput
          placeholder="Tìm kiếm bằng SĐT"
          searchQuery={searchContractQuery}
          setSearchQuery={setSearchContractQuery}
          handleSubmitSearch={handleSubmitSearch}
          keyboardType="phone-pad"
        />
      </View>

      {allContractsEmpty ? (
        <View className="flex-1 justify-center items-center">
          <EmptyState
            title="Không có hợp đồng nào"
            subtitle="Vui lòng kiểm tra lại sau."
            onRefresh={onRefresh}
          />
        </View>
      ) : !loading ? (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.contractId + index}
          onRefresh={onRefresh}
          refreshing={loading}
          renderSectionHeader={({ section }) => (
            <TouchableOpacity
              onPress={() => toggleSection(section.key)}
              className={`m-2 p-4 flex-row justify-between rounded-full ${
                section.key === "pendingContracts"
                  ? "bg-[#DBE2EF]"
                  : section.key === "validContracts"
                  ? "bg-[#32CD32]"
                  : "bg-[#FF4500]"
              }`}
            >
              <Text className="font-bold text-lg">{section.title}</Text>
              <Text className="font-bold text-lg">
                {section.data.length} Hợp Đồng
              </Text>
            </TouchableOpacity>
          )}
          renderItem={({ item, section }) =>
            !collapsedSections[section.key] ? (
              <View className="p-5">
                <RenderContractCard
                  contract={[item]}
                  onRefresh={onRefresh}
                  refreshing={loading}
                />
              </View>
            ) : null
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#5F60B9" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Contract;
