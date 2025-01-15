import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { excludedActionsPending } from "./specialUISlice";
import { Request, RequestValues } from "../../models/request";

export type TRequest = {
  newRequestList: { requests: Request[]; total: number };
  processingRequestList: { requests: Request[]; total: number };
  completedRequestList: { requests: Request[]; total: number };
  canceledRequestList: { requests: Request[]; total: number };
  todaysRequestList: { requests: Request[]; total: number };
  currentRequestList: { requests: Request[]; total: number };
  currentRequest: Request;
  requestValues: RequestValues;
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TRequest = {
  newRequestList: { requests: [], total: 0 },
  processingRequestList: { requests: [], total: 0 },
  completedRequestList: { requests: [], total: 0 },
  canceledRequestList: { requests: [], total: 0 },
  todaysRequestList: { requests: [], total: 0 },
  currentRequestList: { requests: [], total: 0 },
  currentRequest: {
    workerList: [],
    customer_Leader: [],
    productList: [],
    request: {
      categoryRequest: 0,
      conclusion: "",
      contract: null,
      contractId: "",
      customer: null,
      customerId: "",
      customerProblem: "",
      end: "",
      feedbacks: [],
      fileUrl: null,
      isOnlinePayment: false,
      leader: null,
      leaderId: "",
      orderCode: "",
      priceRequests: [],
      purchaseTime: "",
      requestId: "",
      roomId: "",
      start: "",
      status: 0,
      totalPrice: 0,
      requestPrice: 0,
    },
  },
  requestValues: { requestPrice: 0 },
  isFetching: false,
  isSending: false,
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setNewRequestList: (
      state,
      action: PayloadAction<TRequest["newRequestList"]>,
    ) => {
      state.newRequestList = action.payload;
    },
    setProcessingRequestList: (
      state,
      action: PayloadAction<TRequest["processingRequestList"]>,
    ) => {
      state.processingRequestList = action.payload;
    },
    setCompletedRequestList: (
      state,
      action: PayloadAction<TRequest["completedRequestList"]>,
    ) => {
      state.completedRequestList = action.payload;
    },
    setCanceledRequestList: (
      state,
      action: PayloadAction<TRequest["canceledRequestList"]>,
    ) => {
      state.canceledRequestList = action.payload;
    },
    setCurrentRequestList: (
      state,
      action: PayloadAction<TRequest["canceledRequestList"]>,
    ) => {
      state.canceledRequestList = action.payload;
    },
    setTodaysRequestList: (
      state,
      action: PayloadAction<TRequest["todaysRequestList"]>,
    ) => {
      state.todaysRequestList = action.payload;
    },
    setCurrentRequest: (
      state,
      action: PayloadAction<TRequest["currentRequest"]>,
    ) => {
      state.currentRequest = action.payload;
    },
    setRequestValues: (
      state,
      action: PayloadAction<TRequest["requestValues"]>,
    ) => {
      state.requestValues = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("request/fetch/") &&
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
          action.type.startsWith("request/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("request/send/") &&
          action.type.endsWith("/fulfilled") &&
          !["request/send/updatePriceOfRequest/fulfilled"].includes(
            action.type,
          ),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("request/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const getAllRequestsPaginated = createAsyncThunk<
  any,
  GetAllRequestsPaginatedParams
>(
  "request/fetch/getAllRequestsPaginated",
  async (data, { rejectWithValue }) => {
    const { PageIndex, Pagesize, Status } = data;
    try {
      const response = await agent.Request.getAllRequestsPaginated({
        PageIndex,
        Pagesize,
        Status,
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

export const getAllTodaysRequestsPaginated = createAsyncThunk<
  any,
  GetAllTodaysRequestsPaginatedParams
>(
  "request/fetch/getAllTodaysRequestsPaginated",
  async (data, { rejectWithValue }) => {
    const { PageIndex, Pagesize, Date } = data;
    try {
      const response = await agent.Request.getAllTodaysRequestsPaginated({
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
  },
);

export const getDetailsOfRequest = createAsyncThunk<
  any,
  GetDetailsOfRequestParams
>("request/fetch/getDetailsOfRequest", async (data, { rejectWithValue }) => {
  const { RequestId } = data;
  try {
    const response = await agent.Request.getDetailsOfRequest({
      RequestId,
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

export const getCurrentPriceOfRequest = createAsyncThunk<any, void>(
  "request/fetch/getCurrentPriceOfRequest",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Request.getCurrentPriceOfRequest();
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

export const updatePriceOfRequest = createAsyncThunk<
  any,
  UpdatePriceOfRequestParams
>("request/send/updatePriceOfRequest", async (data, { rejectWithValue }) => {
  const { price } = data;
  try {
    const response = await agent.Request.updatePriceOfRequest({
      price,
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

export const {
  setNewRequestList,
  setCompletedRequestList,
  setProcessingRequestList,
  setCanceledRequestList,
  setCurrentRequest,
  setTodaysRequestList,
  setCurrentRequestList,
  setRequestValues,
} = requestSlice.actions;

export default requestSlice.reducer;

export type GetAllRequestsPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  Status?: number;
};

export type GetAllTodaysRequestsPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  Date: string;
};

export type GetDetailsOfRequestParams = {
  RequestId: string;
};

export type UpdatePriceOfRequestParams = {
  price: number;
};
