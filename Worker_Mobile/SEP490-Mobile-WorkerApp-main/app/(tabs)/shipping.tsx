import FullScreenSpinner from "@/components/shared/FullScreenSpinner";

import { API_Shipping_GetShippingOrders } from "@/api/shipping";
import ShippingOrderAccordions from "@/components/shipping/ShippingOrderAccordions";
import { ShippingOrder } from "@/models/ShippingOrder";
import { RootState } from "@/redux/store";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
export default function ShippingScreen() {
  const isLoading = useSelector(
    (state: RootState) => state.homeScreen.isLoading
  );
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>();
  const refresh = () => {
    setShippingOrders(undefined);
    API_Shipping_GetShippingOrders().then((response) => {
      setShippingOrders(response);
    });
  };
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  return (
    <View style={styles.container}>
      {isLoading || shippingOrders === undefined ? (
        <FullScreenSpinner />
      ) : (
        <ShippingOrderAccordions shippingOrders={shippingOrders} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
