import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { User } from "../../models/user";
import { jwtDecode } from "jwt-decode";
import { excludedActionsPending } from "./specialUISlice";

const token = localStorage.getItem("access_token");
let initUser = {};
if (token && token !== "undefined") {
  initUser = jwtDecode(token);
  // initUser = {
  //   Role: "2",
  //   AccountId: "1",
  //   avatarUrl: "",
  //   DateOfBirth: "",
  //   DisabledReason: "",
  //   email: "admin@gmail.com",
  //   fullName: "abc",
  //   isDisabled: false,
  //   PhoneNumber: "13333333333",
  // };
} else {
  localStorage.clear();
}

export type TAuth = {
  currentUser: User;
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TAuth = {
  currentUser: initUser as User,
  isFetching: false,
  isSending: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<TAuth["currentUser"]>) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/fetch/") &&
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
          action.type.startsWith("auth/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("auth/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const login = createAsyncThunk<any, LoginParams>(
  "auth/send/login",
  async (data, { rejectWithValue }) => {
    const { email_Or_Phone, password } = data;
    try {
      const response = await agent.Account.login({
        email_Or_Phone,
        password,
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

export const getAccountInfo = createAsyncThunk<any, void>(
  "auth/fetch/getAccountInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Account.getAccountInfo();
      return response.response;
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

export const logout = createAsyncThunk<any, void>(
  "auth/send/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Account.logout({});
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

export const sendPasswordResetLink = createAsyncThunk<
  any,
  SendPasswordResetLinkParams
>("auth/send/sendPasswordResetLink", async (data, { rejectWithValue }) => {
  const { email } = data;
  try {
    const response = await agent.Account.sendPasswordResetLink({ email });
    return response.response;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
});

export const resetPassword = createAsyncThunk<any, ResetPasswordParams>(
  "auth/send/resetPassword",
  async (data, { rejectWithValue }) => {
    const { password, token } = data;
    try {
      const response = await agent.Account.resetPassword({ password, token });
      return response.response;
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

export const { setCurrentUser } = authSlice.actions;

export const isLoggedIn = () => {
  return !!localStorage.getItem("access_token");
};

export default authSlice.reducer;

export type LoginParams = {
  email_Or_Phone: string;
  password: string;
};

export type SendPasswordResetLinkParams = {
  email: string;
};

export type ResetPasswordParams = {
  token: string;
  password: string;
};
