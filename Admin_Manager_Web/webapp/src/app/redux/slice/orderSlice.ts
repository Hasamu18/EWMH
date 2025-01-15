import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { excludedActionsPending } from "./specialUISlice";
import { Order, OrderDetails, RequestOrder } from "../../models/order";

export type TOrder = {
  currentOrderList: { orders: Order[]; total: number };
  todaysOrderList: { orders: Order[]; total: number };
  currentRequestOrderList: { orders: RequestOrder[]; total: number };
  currentOrder: OrderDetails;
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TOrder = {
  currentOrderList: { orders: [], total: 0 },
  todaysOrderList: { orders: [], total: 0 },
  currentRequestOrderList: { orders: [], total: 0 },
  currentOrder: {
    apartment: {
      address: "",
      areaId: "",
      avatarUrl: "",
      description: "",
      leader: null,
      leaderId: "",
      managementCompany: "",
      name: "",
    },
    customer: { email: "", fullName: "", phoneNumber: "" },
    leader: null,
    order: null,
  },
  isFetching: false,
  isSending: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCurrentOrderList: (
      state,
      action: PayloadAction<TOrder["currentOrderList"]>,
    ) => {
      state.currentOrderList = action.payload;
    },
    setTodaysOrderList: (
      state,
      action: PayloadAction<TOrder["todaysOrderList"]>,
    ) => {
      state.todaysOrderList = action.payload;
    },
    setCurrentRequestOrderList: (
      state,
      action: PayloadAction<TOrder["currentRequestOrderList"]>,
    ) => {
      state.currentRequestOrderList = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<TOrder["currentOrder"]>) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("order/fetch/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        () => {
          return {
            ...initialState,
            isFetching: true,
          };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("order/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("order/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("order/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const getAllOrderPaginated = createAsyncThunk<
  any,
  GetAllOrderPaginatedParams
>("order/fetch/getAllOrderPaginated", async (data, { rejectWithValue }) => {
  const { PageIndex, Pagesize, DescreasingDateSort, SearchByPhone } = data;
  try {
    const response = await agent.Order.getAllOrderPaginated({
      PageIndex,
      Pagesize,
      DescreasingDateSort,
      SearchByPhone,
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
});

export const getTodaysOrdersPaginated = createAsyncThunk<
  any,
  GetTodaysOrderPaginatedParams
>("order/fetch/getTodaysOrdersPaginated", async (data, { rejectWithValue }) => {
  const { PageIndex, Pagesize, Date } = data;
  try {
    const response = await agent.Order.getTodaysOrdersPaginated({
      PageIndex,
      Pagesize,
      Date,
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
});

export const getAllRequestOrdersPaginated = createAsyncThunk<
  any,
  GetAllOrderPaginatedParams
>(
  "order/fetch/getAllRequestOrdersPaginated",
  async (data, { rejectWithValue }) => {
    const { PageIndex, Pagesize, DescreasingDateSort, SearchByPhone } = data;
    try {
      const response = await agent.Order.getAllRequestOrdersPaginated({
        PageIndex,
        Pagesize,
        DescreasingDateSort,
        SearchByPhone,
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
    }
  },
);

export const getOrderDetails = createAsyncThunk<any, GetOrderParams>(
  "order/fetch/getOrderDetails",
  async (data, { rejectWithValue }) => {
    const { OrderId } = data;
    try {
      const response = await agent.Order.getOrderDetails({
        OrderId,
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
    }
  },
);

export const {
  setCurrentOrderList,
  setCurrentOrder,
  setCurrentRequestOrderList,
  setTodaysOrderList,
} = orderSlice.actions;

export default orderSlice.reducer;

export type GetAllOrderPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByPhone?: string;
  DescreasingDateSort?: boolean;
};

export type GetTodaysOrderPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  Date: string;
};

export type GetOrderParams = {
  OrderId: string;
};
