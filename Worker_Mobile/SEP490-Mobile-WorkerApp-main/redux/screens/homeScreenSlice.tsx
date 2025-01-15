import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HomeScreenState = {
  isLoading: boolean;
  isFirstFetchCompleted: boolean;
  requestId: string;
};
const initialState: HomeScreenState = {
  isLoading: true,
  isFirstFetchCompleted: false,
  requestId: "",
};

const homeScreenSlice = createSlice({
  name: "homeScreen",
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsFirstFetchCompleted(state, action: PayloadAction<boolean>) {
      state.isFirstFetchCompleted = action.payload;
    },
    setRequestId(state, action: PayloadAction<string>) {
      state.requestId = action.payload;
    },
  },
});

export const { setIsLoading, setIsFirstFetchCompleted, setRequestId } =
  homeScreenSlice.actions;
export default homeScreenSlice.reducer;
