import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import {
  Customer,
  Leader,
  PendingCustomer,
  User,
  Worker,
} from "../../models/user";
import { excludedActionsPending } from "./specialUISlice";
import dayjs, { Dayjs } from "dayjs";

export type TAccount = {
  currentUserList: {
    users: (User | Leader | Customer)[];
    total: number;
  };
  currentPendingAccountList: {
    users: PendingCustomer[];
    total: number;
  };
  currentLeaderList: {
    users: Leader[];
    total: number;
  };
  freeLeaderList: {
    users: Leader[];
  };
  workerOfLeaderList: {
    users: User[];
  };
  currentWorkerList: {
    users: Worker[];
    total: number;
  };
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TAccount = {
  currentUserList: { users: [], total: 0 },
  currentPendingAccountList: { users: [], total: 0 },
  currentLeaderList: { users: [], total: 0 },
  freeLeaderList: { users: [] },
  currentWorkerList: { users: [], total: 0 },
  workerOfLeaderList: { users: [] },
  isFetching: false,
  isSending: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUserList: (
      state,
      action: PayloadAction<TAccount["currentUserList"]>,
    ) => {
      state.currentUserList = action.payload;
    },
    setCurrentPendingAccountList: (
      state,
      action: PayloadAction<TAccount["currentPendingAccountList"]>,
    ) => {
      state.currentPendingAccountList = action.payload;
    },
    setCurrentLeaderList: (
      state,
      action: PayloadAction<TAccount["currentLeaderList"]>,
    ) => {
      state.currentLeaderList = action.payload;
    },
    setFreeLeaderList: (
      state,
      action: PayloadAction<TAccount["freeLeaderList"]>,
    ) => {
      state.freeLeaderList = action.payload;
    },
    setCurrentWorkerList: (
      state,
      action: PayloadAction<TAccount["currentWorkerList"]>,
    ) => {
      state.currentWorkerList = action.payload;
    },
    setWorkerOfLeaderList: (
      state,
      action: PayloadAction<TAccount["workerOfLeaderList"]>,
    ) => {
      state.workerOfLeaderList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("account/fetch/") &&
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
          action.type.startsWith("account/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("account/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("account/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const getAllAccountPaginated = createAsyncThunk<
  any,
  GetAllAccountPaginatedParams
>("account/fetch/getAllAccountPaginated", async (data, { rejectWithValue }) => {
  const { IsDisabled, PageIndex, Pagesize, Role, SearchByEmail } = data;
  try {
    const response = await agent.Account.getAllAccountPaginated({
      IsDisabled,
      PageIndex,
      Pagesize,
      Role,
      SearchByEmail,
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

export const getAllLeaderPaginated = createAsyncThunk<
  any,
  GetAllLeaderPaginatedParams
>("account/fetch/getAllLeaderPaginated", async (data, { rejectWithValue }) => {
  const { IsDisabled, PageIndex, Pagesize, SearchByEmail } = data;
  try {
    const response = await agent.Account.getAllLeaderPaginated({
      IsDisabled,
      PageIndex,
      Pagesize,
      SearchByEmail,
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

export const getAllLeaderPaginatedExcluded = createAsyncThunk<
  any,
  GetAllLeaderPaginatedParams
>(
  "account/fetch/getAllLeaderPaginatedExcluded",
  async (data, { rejectWithValue }) => {
    const { IsDisabled, PageIndex, Pagesize, SearchByEmail } = data;
    try {
      const response = await agent.Account.getAllLeaderPaginated({
        IsDisabled,
        PageIndex,
        Pagesize,
        SearchByEmail,
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

export const getAllFreeLeaders = createAsyncThunk<any, void>(
  "account/fetch/getAllFreeLeaders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Account.getAllFreeLeaders();
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

export const getAllWorkerFromLeader = createAsyncThunk<
  any,
  GetAllWorkerFromLeaderParams
>("account/fetch/getAllWorkerFromLeader", async (data, { rejectWithValue }) => {
  const { LeaderId } = data;
  try {
    const response = await agent.Account.getAllWorkerFromLeader({ LeaderId });
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

export const getAllPendingAccountPaginated = createAsyncThunk<
  any,
  GetAllPendingAccountPaginatedParams
>(
  "account/fetch/getAllPendingAccountPaginated",
  async (data, { rejectWithValue }) => {
    const { PageIndex, Pagesize, SearchByPhone } = data;
    try {
      const response = await agent.Account.getAllPendingAccountPaginated({
        PageIndex,
        Pagesize,
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

export const getAllWorkerPaginated = createAsyncThunk<
  any,
  GetAllWorkerPaginatedParams
>("account/fetch/getAllWorkerPaginated", async (data, { rejectWithValue }) => {
  const { PageIndex, Pagesize, SearchByPhone, IsDisabled } = data;
  try {
    const response = await agent.Account.getAllWorkerPaginated({
      PageIndex,
      Pagesize,
      SearchByPhone,
      IsDisabled,
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

export const createPersonnelAccount = createAsyncThunk<
  any,
  CreatePersonnelAccountParams
>("account/send/createPersonnelAccount", async (data, { rejectWithValue }) => {
  const { fullName, email, phoneNumber, dateOfBirth, role } = data;

  const sanitizedPhoneNumber = phoneNumber.replace(/\s+/g, "");

  let stringDateOfBirth = "";
  if (typeof dateOfBirth === "string") {
    stringDateOfBirth = dateOfBirth;
  }
  if (dayjs.isDayjs(dateOfBirth)) {
    stringDateOfBirth = dateOfBirth.toISOString();
  }
  try {
    const response = await agent.Account.createPersonnelAccount({
      fullName,
      email,
      phoneNumber: sanitizedPhoneNumber,
      dateOfBirth: stringDateOfBirth.split("T")[0],
      role,
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

export const disableUser = createAsyncThunk<any, DisableUserParams>(
  "account/send/disableUser",
  async (data, { rejectWithValue }) => {
    const { accountId, disable, disabledReason } = data;
    try {
      const response = await agent.Account.disableUser({
        accountId,
        disable,
        disabledReason,
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

export const assignWorkerToLeader = createAsyncThunk<
  any,
  AssignWorkerToLeaderParams
>("account/send/assignWorkerToLeader", async (data, { rejectWithValue }) => {
  const { leaderId, workerId } = data;
  try {
    const response = await agent.Account.assignWorkerToLeader({
      leaderId,
      workerId,
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

export const approveCustomerAccount = createAsyncThunk<
  any,
  ApproveCustomerAccountParams
>("account/send/approveCustomerAccount", async (data, { rejectWithValue }) => {
  const { isApproval, pendingAccountId, roomIds, reason } = data;
  try {
    const response = await agent.Account.approveCustomerAccount({
      isApproval,
      pendingAccountId,
      roomIds,
      reason,
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
  setCurrentUserList,
  setCurrentLeaderList,
  setCurrentWorkerList,
  setCurrentPendingAccountList,
  setFreeLeaderList,
  setWorkerOfLeaderList,
} = accountSlice.actions;

export default accountSlice.reducer;

export type GetAllAccountPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByEmail?: string;
  Role?: string;
  IsDisabled?: boolean;
};

export type GetAllLeaderPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByEmail?: string;
  IsDisabled?: boolean;
};

export type GetAllWorkerPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByPhone?: string;
  IsDisabled?: boolean;
};

export type GetAllWorkerFromLeaderParams = {
  LeaderId: string;
};

export type GetAllPendingAccountPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByPhone?: string;
};

export type DisableUserParams = {
  accountId: string;
  disable: boolean;
  disabledReason: string;
};

export type AssignWorkerToLeaderParams = {
  workerId: string;
  leaderId: string;
};

export type CreatePersonnelAccountParams = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string | Dayjs;
  role: string;
};

export type ApproveCustomerAccountParams = {
  pendingAccountId: string;
  roomIds: string[];
  isApproval: boolean;
  reason: string | null;
};
