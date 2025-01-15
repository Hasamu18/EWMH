import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { excludedActionsPending } from "./specialUISlice";
import { Feedback, FeedbackDetails } from "../../models/feedback";

export type TFeedback = {
  currentFeedbackList: {
    feedbacks: Feedback[];
    total: number;
    averageRate: number;
  };
  currentFeedback: FeedbackDetails;
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TFeedback = {
  currentFeedbackList: { feedbacks: [], total: 0, averageRate: 0 },
  currentFeedback: {
    avatarUrl: "",
    content: "",
    customerAddress: "",
    customerEmail: "",
    customerName: "",
    customerPhone: "",
    feedbackId: "",
    rate: 0,
    status: false,
    time: "",
  },
  isFetching: false,
  isSending: false,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setCurrentFeedbackList: (
      state,
      action: PayloadAction<TFeedback["currentFeedbackList"]>,
    ) => {
      state.currentFeedbackList = action.payload;
    },
    setCurrentFeedback: (
      state,
      action: PayloadAction<TFeedback["currentFeedback"]>,
    ) => {
      state.currentFeedback = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("feedback/fetch/") &&
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
          action.type.startsWith("feedback/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("feedback/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("feedback/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const getAllFeedbacksPaginated = createAsyncThunk<
  any,
  GetAllFeedbacksPaginatedParams
>(
  "feedback/fetch/getAllFeedbacksPaginated",
  async (data, { rejectWithValue }) => {
    const { pageIndex, pagesize, sortByStarOrder, status } = data;
    try {
      const response = await agent.Feedback.getAllFeedbacksPaginated({
        pageIndex,
        pagesize,
        sortByStarOrder,
        status,
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

export const getFeedbackDetails = createAsyncThunk<
  any,
  GetFeedbackDetailsParams
>("feedback/fetch/getFeedbackDetails", async (data, { rejectWithValue }) => {
  const { feedbackId } = data;
  try {
    const response = await agent.Feedback.getFeedbackDetails({
      feedbackId,
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

export const approveFeedback = createAsyncThunk<any, ApproveFeedbackParams>(
  "feedback/send/approveFeedback",
  async (data, { rejectWithValue }) => {
    const { feedbackId } = data;

    try {
      const response = await agent.Feedback.approveFeedback({ feedbackId });
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

export const { setCurrentFeedbackList, setCurrentFeedback } =
  feedbackSlice.actions;

export default feedbackSlice.reducer;

export type GetAllFeedbacksPaginatedParams = {
  pageIndex: number;
  pagesize: number;
  sortByStarOrder: "asc" | "desc";
  status: 0 | 1 | 2;
};

export type GetFeedbackDetailsParams = {
  feedbackId: string;
};

export type ApproveFeedbackParams = {
  feedbackId: string;
};
