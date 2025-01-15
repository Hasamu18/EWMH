import WarrantyCardList from "@/components/warrantyCards/WarrantyCardList";
import { WarrantyCardSearchBar } from "@/components/warrantyCards/WarrantyCardSearchBar";
import { SCREEN_HEIGHT } from "@/constants/Device";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function WarrantyCardsScreen() {
  return (
    <View style={styles.container}>
      <WarrantyCardSearchBar />
      <View style={styles.warrantyCards}>
        <WarrantyCardList />
      </View>
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
  warrantyCards: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    height: SCREEN_HEIGHT * 0.8,
  },
});
