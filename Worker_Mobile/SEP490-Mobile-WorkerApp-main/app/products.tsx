import ProductList from "@/components/products/ProductList";
import { SearchBar } from "@/components/products/SearchBar";
import { SCREEN_HEIGHT } from "@/constants/Device";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ProductsScreen() {

  return (
    <View style={styles.container}>
      <SearchBar />
      <View style={styles.products}>
        <ProductList />
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
  products: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    height: SCREEN_HEIGHT * 0.8,
  },
});
