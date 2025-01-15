import { API_Requests_GetAll, API_Requests_GetById } from "@/api/requests";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import {
  IN_PROGRESS,
  REPAIR_REQUEST,
  WARRANTY_REQUEST,
} from "@/constants/Request";
import { Request } from "@/models/Request";

import NoRequestsFound from "@/components/home/NoRequestsFound";
import { RequestDetails } from "@/models/RequestDetails";
import { setIsLoading, setRequestId } from "@/redux/screens/homeScreenSlice";
import { RootState } from "@/redux/store";
import { useFocusEffect, useSegments } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RequestDetailsScreen from "../requestDetails";
import WarrantyRequestDetailsScreen from "../warrantyRequestDetails";
export default function HomeScreen() {
  const dispatch = useDispatch();
  const [inProgressRequest, setInProgressRequest] = useState<Request>();
  const [requestDetails, setRequestDetails] = useState<RequestDetails>();
  const segments = useSegments();
  // Check if the current route is "home"
  const isHomeScreen = segments[1] === "home";
  const requestId = useSelector(
    (state: RootState) => state.homeScreen.requestId
  );
  const isLoading = useSelector(
    (state: RootState) => state.homeScreen.isLoading
  );
  let tempInProgressRequest: Request;
  const getInProgressRequest = async () => {
    try {
      setRequestDetails(undefined);
      setInProgressRequest(undefined);

      const [repairRequests, warrantyRequests] = await Promise.all([
        API_Requests_GetAll(REPAIR_REQUEST),
        API_Requests_GetAll(WARRANTY_REQUEST),
      ]);

      const inProgressRepairRequest = repairRequests.find(
        (repairRequest) => repairRequest.status === IN_PROGRESS
      );
      const inProgressWarrantyRequest = warrantyRequests.find(
        (warrantyRequest) => warrantyRequest.status == IN_PROGRESS
      );
      if (inProgressRepairRequest !== undefined)
        tempInProgressRequest = inProgressRepairRequest;
      else if (inProgressWarrantyRequest !== undefined)
        tempInProgressRequest = inProgressWarrantyRequest;
      else return;

      const requestDetails = await API_Requests_GetById(
        tempInProgressRequest?.requestId
      );
      setRequestDetails(requestDetails);
      setInProgressRequest(tempInProgressRequest);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const getInProgressRequestDetailsById = () => {
    API_Requests_GetById(requestId as string).then((response) => {
      setRequestDetails(response);
      dispatch(setRequestId(""));
      dispatch(setIsLoading(false));
    });
  };

  useEffect(() => {
    if (isLoading && requestId === "") getInProgressRequest();
    else if (isLoading && requestId !== "") getInProgressRequestDetailsById();
  }, [isLoading]);
  useFocusEffect(
    useCallback(() => {
      dispatch(setIsLoading(true));
    }, [])
  );

  useEffect(() => {
    const onBackPress = () => {
      if (isHomeScreen) {
        Alert.alert(
          "Thoát ứng dụng",
          "Bạn có chắc chắn muốn thoát ứng dụng?",
          [
            { text: "Hủy", style: "cancel" },
            { text: "Thoát", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
        );
        return true; // Prevent default back navigation
      }
      return false; // Allow default back navigation for other screens
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [isHomeScreen]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <FullScreenSpinner />
      ) : (
        <>
          {requestDetails !== undefined &&
          inProgressRequest !== undefined &&
          inProgressRequest?.categoryRequest === REPAIR_REQUEST ? (
            <RequestDetailsScreen requestDetails={requestDetails} />
          ) : null}
          {requestDetails !== undefined &&
          inProgressRequest !== undefined &&
          inProgressRequest?.categoryRequest === WARRANTY_REQUEST ? (
            <WarrantyRequestDetailsScreen
              warrantyRequestDetails={requestDetails}
            />
          ) : null}
          {inProgressRequest === undefined || requestDetails === undefined ? (
            <View style={styles.noRequestsFound}>
              <NoRequestsFound />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noRequestsFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
