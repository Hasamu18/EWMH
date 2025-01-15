import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { excludedActionsPending } from "./specialUISlice";
import { Contract, ContractDetails } from "../../models/contract";

export type TContract = {
  currentContractList: {
    contracts: Contract[];
    total: number;
  };
  currentContract: ContractDetails;
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TContract = {
  currentContractList: { contracts: [], total: 0 },
  currentContract: {
    contract: {
      contractId: "",
      customerId: "",
      fileUrl: "",
      isOnlinePayment: false,
      orderCode: "",
      purchaseTime: "",
      remainingNumOfRequests: 0,
      servicePackageId: "",
      totalPrice: 0,
    },
    customerInfo: {
      accountId: "",
      avatarUrl: "",
      cmT_CCCD: "",
      dateOfBirth: "",
      disabledReason: "",
      email: "",
      fullName: "",
      isDisabled: false,
      phoneNumber: "",
    },
    requestIdList: [],
  },
  isFetching: false,
  isSending: false,
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setCurrentContractList: (
      state,
      action: PayloadAction<TContract["currentContractList"]>,
    ) => {
      state.currentContractList = action.payload;
    },
    setCurrentContract: (
      state,
      action: PayloadAction<TContract["currentContract"]>,
    ) => {
      state.currentContract = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("contract/fetch/") &&
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
          action.type.startsWith("contract/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("contract/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("contract/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const getAllContractsPaginated = createAsyncThunk<
  any,
  GetAllContractsPaginatedParams
>(
  "contract/fetch/getAllContractsPaginated",
  async (data, { rejectWithValue }) => {
    const { PageIndex, Pagesize, SearchByPhone, PurchaseTime_Des_Sort } = data;
    try {
      const response = await agent.ServicePackage.getAllContractsPaginated({
        PageIndex,
        Pagesize,
        SearchByPhone,
        PurchaseTime_Des_Sort,
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

export const getContractDetails = createAsyncThunk<
  any,
  GetContractDetailsParams
>("contract/fetch/getContractDetails", async (data, { rejectWithValue }) => {
  const { ContractId } = data;
  try {
    const response = await agent.ServicePackage.getContractDetails({
      ContractId,
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

export const { setCurrentContractList, setCurrentContract } =
  contractSlice.actions;

export default contractSlice.reducer;

export type GetAllContractsPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByPhone?: string;
  PurchaseTime_Des_Sort?: boolean;
};

export type GetContractDetailsParams = {
  ContractId: string;
};
