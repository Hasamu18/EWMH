// store/searchSlice.ts
import { GET_WARRANTY_CARD_LIST_ENDPOINT } from "@/constants/Endpoints";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/constants/Pagination";
import { WarrantyCardModel } from "@/models/WarrantyCardModel";
import { WarrantyCardsResponse } from "@/models/WarrantyCardsResponse";
import { WarrantySearchParams } from "@/models/WarrantySearchParams";
import { BuildSearchParams } from "@/utils/SearchParamsUtils";
import { GetAccessToken } from "@/utils/TokenUtils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type WarrantySearchState = {
  searchParams: WarrantySearchParams;
  isLoading: boolean;
  warrantyCards: WarrantyCardModel[];
  total: number;
};

const initialState: WarrantySearchState = {
  searchParams: {
    requestId: "",
    productName: "",
    customerId: "",
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  isLoading: false,
  warrantyCards: [],
  total: 0,
};

export const fetchWarrantyCards = createAsyncThunk(
  "warrantySearch/fetchWarrantyCards",
  async (params: WarrantySearchParams, { dispatch, rejectWithValue }) => {
    try {
      const PARAM_LIST = BuildSearchParams(params);
      const accessToken = await GetAccessToken();
      const response = await fetch(
        GET_WARRANTY_CARD_LIST_ENDPOINT + PARAM_LIST,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await response.json();
      const warrantyCards = json as WarrantyCardsResponse;
      return {
        results: warrantyCards.results,
        total: warrantyCards.count,
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch products");
    } finally {
      dispatch(warrantySearchSlice.actions.setIsLoading(false));
    }
  }
);

const warrantySearchSlice = createSlice({
  name: "warrantySearch",
  initialState,
  reducers: {
    incrementPageIndex: (state) => {
      state.searchParams.pageIndex += 1;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setRequestId(state, action: PayloadAction<string>) {
      state.searchParams.requestId = action.payload;
    },
    setCustomerId(state, action: PayloadAction<string>) {
      state.searchParams.customerId = action.payload;
    },
    setProductName(state, action: PayloadAction<string>) {
      state.searchParams.productName = action.payload;
      state.searchParams.pageIndex = DEFAULT_PAGE_INDEX;
    },
    resetSearch(state) {
      state.searchParams.pageIndex = initialState.searchParams.pageIndex;
      state.searchParams.pageSize = initialState.searchParams.pageSize;
      state.warrantyCards = [];
      state.searchParams.productName = initialState.searchParams.productName;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarrantyCards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWarrantyCards.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.searchParams.pageIndex === 1) {
          state.warrantyCards = action.payload.results;
        } else {
          state.warrantyCards = [
            ...state.warrantyCards,
            ...action.payload.results,
          ];
        }
        state.total = action.payload.total;
      })
      .addCase(fetchWarrantyCards.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {
  incrementPageIndex,
  setRequestId,
  setCustomerId,
  setProductName,
  resetSearch,
  setIsLoading,
} = warrantySearchSlice.actions;
export default warrantySearchSlice.reducer;
