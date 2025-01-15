import { View, SafeAreaView, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import SearchInput from "@/components/custom_components/SearchInput";
import RenderProductItem from "@/components/custom_components/RenderProductItem";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import IconButton from "@/components/custom_components/IconButton";
import { useGlobalState } from "../../context/GlobalProvider";
import ProductSheet from "@/components/custom_components/ProductSheet";
import { useProduct } from "@/hooks/useProduct";
import { useNavigation } from "expo-router";
import { useFakeLoading } from "@/utils/utils";

const ProductScreen = () => {
  const { setIsSheetOpen, setLoading } = useGlobalState();
  const [refreshing, setRefreshing] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const {
    products,
    handleGetProduct,
    searchProductQuery,
    setSearchProductQuery,
    selectedProductFilter,
    setSelectedProductFilter,
  } = useProduct();
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();
  const timeoutRef = useRef<number | null>(null);
  const [fakeLoading, setFakeLoading] = useState(true);
  useFakeLoading(setFakeLoading)

  const fetchProducts = useCallback(
    async (page = 1) => {
      const { products: newProducts, totalPages: fetchedTotalPages } =
        await handleGetProduct(page);
      setTotalPages(fetchedTotalPages);
      setLoading(false);
      return newProducts.length > 0;
    },
    [handleGetProduct, setLoading]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${
        selectedProductFilter
          ? `Tư liệu sửa chữa (${
              selectedProductFilter === true ? `Giá tăng dần` : `Giá giảm dần`
            })`
          : "Tư liệu sửa chữa"
      }`,
      headerTitleAlign: "center",
      headerRight: () => (
        <IconButton
          icon={<FontAwesome5 name="filter" size={20} color="white" />}
          textStyles="text-sm"
          handlePress={() => handleOpenPress()}
          containerStyles="mr-5"
        />
      ),
    });
  }, [navigation, selectedProductFilter]);

  useEffect(() => {
    setLoading(true);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchProducts(pageIndex);
    }, 500) as unknown as number; // Cast setTimeout return to number

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pageIndex, searchProductQuery, selectedProductFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPageIndex(1);
    await fetchProducts(1);
    setSelectedProductFilter(null);
    setRefreshing(false);
  };

  const handleNextPage = async () => {
    if (pageIndex < totalPages) {
      const hasMore = await fetchProducts(pageIndex + 1);
      if (hasMore) setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = async () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleOpenPress = () => {
    setIsSheetOpen(true);
  };

  const handleSubmitSearch = async () => {
    setPageIndex(1);
    await fetchProducts(1);
  };

  if (fakeLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="w-full h-full mt-5 px-4">
      <View className="flex flex-row w-full justify-between mb-5">
        <SearchInput
          placeholder="Tìm kiếm"
          searchQuery={searchProductQuery}
          setSearchQuery={setSearchProductQuery}
          handleSubmitSearch={handleSubmitSearch}
        />
      </View>
      <View className="flex flex-row items-center justify-center my-3">
        <IconButton
          handlePress={handlePreviousPage}
          disabled={pageIndex === 1}
          icon={
            <AntDesign
              name="caretleft"
              size={24}
              color={pageIndex === 1 ? "black" : "white"}
            />
          }
          containerStyles="p-2"
        />
        <Text className="mx-3">
          Trang {pageIndex}/{totalPages}
        </Text>

        <IconButton
          handlePress={handleNextPage}
          disabled={pageIndex >= totalPages}
          icon={
            <AntDesign
              name="caretright"
              size={24}
              color={pageIndex >= totalPages ? "black" : "white"}
            />
          }
          containerStyles="p-2"
        />
      </View>

      <RenderProductItem
        products={products}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <ProductSheet />
    </SafeAreaView>
  );
};

export default ProductScreen;
