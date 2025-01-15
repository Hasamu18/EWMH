import { API_Checkout } from "@/api/checkout";
import { API_Requests_CompleteRequest } from "@/api/requests";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import { CheckoutRequest } from "@/models/CheckoutRequest";
import { CompleteRequest } from "@/models/CompleteRequest";
import { setIsLoading } from "@/redux/screens/homeScreenSlice";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, View } from "react-native";

export default function CheckoutScreen() {
  const { requestId, conclusion } = useLocalSearchParams();
  const [checkoutUrl, setCheckoutUrl] = useState<string>();
  const prepareCheckoutRequest = (): CheckoutRequest => {
    return {
      requestId: requestId as string,
      conclusion: conclusion as string,
    };
  };
  /* 
    Workaround to check if the customer has to
    pay for the repair request, based on the TEXT 
    in the response string. This is to avoid unnecessary API calls, 
    which sounds bulls**t, right? :)) 
  */
  const isFreeRequest = (url: string): boolean => {
    if (url.includes("0 đồng")) return true;
    return false;
  };
  const completeFreeRequest = (checkoutRequest: CheckoutRequest) => {
    // dispatch(setIsLoading(true));
    const completeRequest: CompleteRequest = {
      requestId: checkoutRequest.requestId,
      conclusion: checkoutRequest.conclusion,
    };
    API_Requests_CompleteRequest(completeRequest)
      .then((response) => {
        console.log("response:", response);
        // dispatch(setIsLoading(false));
        router.navigate("/(tabs)/home");
        setIsLoading(true);
      })
      .catch((error) => {
        console.log("Đã có lỗi xảy ra.", error);
      });
  };
  useEffect(() => {
    const checkoutRequest = prepareCheckoutRequest();
    console.log("checkoutreq:", checkoutRequest);
    API_Checkout(checkoutRequest).then((response) => {
      if (isFreeRequest(response)) completeFreeRequest(checkoutRequest);
      else Linking.openURL(response);
    });
  }, []);

  return (
    <View style={styles.container}>
      {checkoutUrl === undefined ? (
        <FullScreenSpinner />
      ) : (
        <View /> //put a webview here....
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    margin: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  products: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
});
