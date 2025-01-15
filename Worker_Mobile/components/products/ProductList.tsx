import {
  fetchProducts,
  incrementPageIndex,
  resetSearch,
} from "@/redux/components/productSearchSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import EmptyList from "../shared/EmptyList";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const dispatch = useDispatch<AppDispatch>();
  const searchSlice = useSelector((state: RootState) => state.productSearch);

  const handleRefresh = () => {
    dispatch(resetSearch());
    dispatch(fetchProducts(searchSlice.searchParams));
  };
  const loadMore = () => {
    if (
      searchSlice.products.length < searchSlice.total &&
      !searchSlice.isLoading
    ) {
      dispatch(incrementPageIndex());
    }
  };
  useEffect(() => {
    dispatch(fetchProducts(searchSlice.searchParams));
  }, [
    dispatch,
    searchSlice.searchParams.PageIndex,
    searchSlice.searchParams.SearchByName,
  ]);
  useEffect(() => {
    return () => {
      dispatch(resetSearch()); //resets all search params when user is no longer seeing the FlatList.
    };
  }, []);
  return (
    <>
      {searchSlice.products.length === 0 ? (
        <View>
          <EmptyList />
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          data={searchSlice.products}
          renderItem={(flatListItem) => (
            <ProductCard product={flatListItem.item} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={searchSlice.isLoading}
              onRefresh={handleRefresh}
            />
          }
          onEndReachedThreshold={0.01}
          keyExtractor={(product) => product.productId}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  spinner: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
  flatList: {
    width: "100%",
    flex: 1,
  },
});
