import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWarrantyCards,
  incrementPageIndex,
  resetSearch,
  setIsLoading,
} from "../../redux/components/warrantySearchSlice";
import EmptyList from "../shared/EmptyList";
import WarrantyCard from "./WarrantyCard";

export default function WarrantyCardList() {
  const dispatch = useDispatch<AppDispatch>();
  const warrantyCardSearchSlice = useSelector(
    (state: RootState) => state.warrantyCardSearch
  );

  const handleRefresh = () => {
    dispatch(resetSearch());
    dispatch(setIsLoading(true));
    dispatch(fetchWarrantyCards(warrantyCardSearchSlice.searchParams));
  };
  const loadMore = () => {
    if (
      warrantyCardSearchSlice.warrantyCards.length <
        warrantyCardSearchSlice.total &&
      !warrantyCardSearchSlice.isLoading
    ) {
      dispatch(incrementPageIndex());
    }
  };
  useEffect(() => {
    dispatch(setIsLoading(true));
    dispatch(fetchWarrantyCards(warrantyCardSearchSlice.searchParams));
  }, [
    dispatch,
    warrantyCardSearchSlice.searchParams.pageIndex,
    warrantyCardSearchSlice.searchParams.productName,
  ]);
  useEffect(() => {
    return () => {
      dispatch(resetSearch()); //resets all search params when user is no longer seeing the FlatList.
    };
  }, []);
  return (
    <View style={styles.container}>
      <>
        {warrantyCardSearchSlice.warrantyCards.length === 0 ? (
          <EmptyList />
        ) : (
          <>
            {warrantyCardSearchSlice.warrantyCards.length === 1 ? (
              <WarrantyCard
                warrantyCard={warrantyCardSearchSlice.warrantyCards[0]}
              />
            ) : (
              <FlatList
                style={styles.flatList}
                numColumns={1}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                data={warrantyCardSearchSlice.warrantyCards}
                renderItem={(flatListItem) => (
                  <WarrantyCard warrantyCard={flatListItem.item} />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={warrantyCardSearchSlice.isLoading}
                    onRefresh={handleRefresh}
                  />
                }
                onEndReachedThreshold={0.01}
                keyExtractor={(warrantyCard) => warrantyCard.warrantyCardId}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
              />
            )}
          </>
        )}
      </>
    </View>
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
