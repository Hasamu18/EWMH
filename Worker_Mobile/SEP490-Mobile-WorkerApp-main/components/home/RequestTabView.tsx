import Colors from "@/constants/Colors";
import { SCREEN_WIDTH } from "@/constants/Device";

import { API_Requests_GetAll } from "@/api/requests";
import {
  IN_PROGRESS,
  REPAIR_REQUEST,
  WARRANTY_REQUEST,
} from "@/constants/Request";
import { Request } from "@/models/Request";
import { RootState } from "@/redux/store";
import { ScrollView, VStack } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  NavigationState,
  Route,
  SceneMap,
  TabBar,
  TabView,
} from "react-native-tab-view";
import { useSelector } from "react-redux";
import FullScreenSpinner from "../shared/FullScreenSpinner";
import RequestCard from "./RequestCard";

export default function RequestTabView() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Sửa Chữa" },
    { key: "second", title: "Bảo Hành" },
  ]);

  const renderScene = SceneMap({
    first: RepairRequests,
    second: WarrantyRequests,
  });
  return (
    <TabView
      navigationState={{ index, routes } as State}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: SCREEN_WIDTH }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={styles.tabView}
          indicatorStyle={{ backgroundColor: "white" }}
          activeColor={Colors.ewmh.foreground}
          inactiveColor="#a1a1aa"
        />
      )}
    />
  );
}

function RepairRequests() {
  const [repairRequests, setRepairRequests] = useState<Request[]>();
  const isLoading = useSelector(
    (state: RootState) => state.homeScreen.isLoading
  );
  const refresh = () => {
    setRepairRequests(undefined);
    API_Requests_GetAll(REPAIR_REQUEST).then((response) => {
      setRepairRequests(response);
    });
  };
  useEffect(() => {
    refresh();
  }, [isLoading]);

  return (
    <>
      {repairRequests === undefined ? (
        <FullScreenSpinner />
      ) : (
        <InProgressRepairRequests repairRequests={repairRequests} />
      )}
    </>
  );
}
interface InProgressRepairRequestsProps {
  repairRequests: Request[];
}
function InProgressRepairRequests({
  repairRequests,
}: InProgressRepairRequestsProps) {
  const [inProgressRequests, setInProgressRequests] = useState<Request[]>();
  useEffect(() => {
    const filteredRequests = repairRequests.filter(
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
function WarrantyRequests() {
  const [warrantyRequests, setWarrantyRequests] = useState<Request[]>();
  const isLoading = useSelector(
    (state: RootState) => state.homeScreen.isLoading
  );
  const refresh = () => {
    setWarrantyRequests(undefined);
    API_Requests_GetAll(WARRANTY_REQUEST).then((response) => {
      setWarrantyRequests(response);
    });
  };
  useEffect(() => {
    refresh();
  }, [isLoading]);

  return (
    <>
      {warrantyRequests === null || warrantyRequests === undefined ? (
        <FullScreenSpinner />
      ) : (
        <InProgressWarrantyRequests warrantyRequests={warrantyRequests} />
      )}
    </>
  );
}

interface InProgressWarrantyRequestProps {
  warrantyRequests: Request[];
}
function InProgressWarrantyRequests({
  warrantyRequests,
}: InProgressWarrantyRequestProps) {
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

type TabRoute = Route & {
  key: string;
  title: string;
};
type State = NavigationState<TabRoute>;

const styles = StyleSheet.create({
  tabView: {
    backgroundColor: Colors.ewmh.background,
    borderWidth: 0,
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    padding: 10,
  },
});
