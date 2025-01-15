// store/searchSlice.ts
import { PRODUCTS_ENDPOINT } from "@/constants/Endpoints";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/constants/Pagination";
import { Product } from "@/models/Product";
import { ProductSearchParams } from "@/models/ProductSearchParams";
import { ProductsResponse } from "@/models/ProductsResponse";
import { BuildSearchParams } from "@/utils/SearchParamsUtils";
import { GetAccessToken } from "@/utils/TokenUtils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProductSearchState = {
  searchParams: ProductSearchParams;
  products: Product[];
  total: number;
  isLoading: boolean;
};

const initialState: ProductSearchState = {
  searchParams: {
    PageIndex: DEFAULT_PAGE_INDEX,
    Pagesize: DEFAULT_PAGE_SIZE,
    SearchByName: "",
    InOfStock_Sort: false,
    Status: false,
  },
  products: [],
  total: 0,
  isLoading: false,
};

export const fetchProducts = createAsyncThunk(
  "productSearch/fetchProducts",
  async (params: ProductSearchParams, { rejectWithValue }) => {
    try {
      const PARAM_LIST = BuildSearchParams(params);
      const accessToken = await GetAccessToken();
      const response = await fetch(PRODUCTS_ENDPOINT + PARAM_LIST, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await response.json();
      const products = json as ProductsResponse;
      return {
        results: products.results,
        total: products.count,
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

const productSearchSlice = createSlice({
  name: "productSearch",
  initialState,
  reducers: {
    incrementPage: (state) => {
      state.searchParams.PageIndex += 1;
    },
    setPageIndex(state, action: PayloadAction<number>) {
      state.searchParams.PageIndex = action.payload;
    },
    setPagesize(state, action: PayloadAction<number>) {
      state.searchParams.Pagesize = action.payload;
    },
    setSearchByName(state, action: PayloadAction<string>) {
      state.searchParams.SearchByName = action.payload;
      state.searchParams.PageIndex = DEFAULT_PAGE_INDEX;
    },
    setInOfStock_Sort(state, action: PayloadAction<boolean>) {
      state.searchParams.InOfStock_Sort = action.payload;
    },
    setStatus(state, action: PayloadAction<boolean>) {
      state.searchParams.Status = action.payload;
    },
    incrementPageIndex(state) {
      state.searchParams.PageIndex += 1;
    },
    resetSearch(state) {
      state.searchParams.PageIndex = initialState.searchParams.PageIndex;
      state.searchParams.Pagesize = initialState.searchParams.Pagesize;
      state.products = [];
      state.searchParams.SearchByName = initialState.searchParams.SearchByName;
      state.searchParams.InOfStock_Sort =
        initialState.searchParams.InOfStock_Sort;
      state.searchParams.Status = initialState.searchParams.Status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Filter out products with `status = 0 (not disabled)`
        const nonDisabledProducts = action.payload.results.filter(
          (product: Product) => product.status === false
        );
        if (state.searchParams.PageIndex === 1) {
          state.products = nonDisabledProducts;
        } else {
          state.products = [...state.products, ...nonDisabledProducts];
        }
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {
  setPageIndex,
  setPagesize,
  setSearchByName,
  setInOfStock_Sort,
  setStatus,
  resetSearch,
  incrementPageIndex,
} = productSearchSlice.actions;
export default productSearchSlice.reducer;
