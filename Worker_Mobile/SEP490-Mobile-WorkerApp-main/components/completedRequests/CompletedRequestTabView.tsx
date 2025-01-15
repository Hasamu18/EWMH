import Colors from "@/constants/Colors";
import { SCREEN_WIDTH } from "@/constants/Device";

import { API_Requests_GetAll } from "@/api/requests";
import {
  COMPLETED,
  REPAIR_REQUEST,
  WARRANTY_REQUEST,
} from "@/constants/Request";
import { Request } from "@/models/Request";
import { RootState } from "@/redux/store";
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
import CompletedRequestList from "./CompletedRequestList";

export default function CompletedRequestTabView() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Sửa Chữa" },
    { key: "second", title: "Bảo Hành" },
  ]);

  const renderScene = SceneMap({
    first: CompletedRepairRequests,
    second: CompletedWarrantyRequests,
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

function CompletedRepairRequests() {
  const [completedRepairRequests, setCompletedRepairRequests] =
    useState<Request[]>();

  const isLoading = useSelector(
    (state: RootState) => state.homeScreen.isLoading
  );
  const refresh = () => {
    API_Requests_GetAll(REPAIR_REQUEST).then((response) => {
      setCompletedRepairRequests(response);
    });
  };
  useEffect(() => {
    refresh();
  }, [isLoading]);

  return (
    <>
      {completedRepairRequests === undefined ? (
        <FullScreenSpinner />
      ) : (
        <CompletedRequestList requests={completedRepairRequests} />
      )}
    </>
  );
}

function CompletedWarrantyRequests() {
  const [completedWarrantyRequests, setCompletedWarrantyRequests] =
    useState<Request[]>();
  const isLoading = useSelector(
    (state: RootState) => state.homeScreen.isLoading
  );
  const refresh = () => {
    API_Requests_GetAll(WARRANTY_REQUEST).then((response) => {
      const completedRequests = response
        .filter((request) => request.status === COMPLETED)
        .sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
        );
      setCompletedWarrantyRequests(completedRequests);
    });
  };
  useEffect(() => {
    refresh();
  }, [isLoading]);

  return (
    <>
      {completedWarrantyRequests === undefined ? (
        <FullScreenSpinner />
      ) : (
        <CompletedRequestList requests={completedWarrantyRequests} />
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
