import { UpdateProfileRequest } from "@/models/UpdateProfileRequest";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UpdateProfileState = {
  updateProfileRequest: UpdateProfileRequest;
  isUpdatingProfile: boolean;
};
const initialState: UpdateProfileState = {
  //   userProfile: {
  //     accountId: "",
  //     fullName: "",
  //     email: "",
  //     phoneNumber: "",
  //     avatarUrl: "",
  //     dateOfBirth: "",
  //   },
  updateProfileRequest: {
    email: "",
    dateOfBirth: "",
    fullName: "",
  },
  isUpdatingProfile: false,
};

const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState,
  reducers: {
    setUpdateProfileRequest(
      state,
      action: PayloadAction<UpdateProfileRequest>
    ) {
      state.updateProfileRequest = action.payload;
    },
    setIsUpdatingProfile(state, action: PayloadAction<boolean>) {
      state.isUpdatingProfile = action.payload;
    },
  },
});

export const { setUpdateProfileRequest, setIsUpdatingProfile } =
  updateProfileSlice.actions;
export default updateProfileSlice.reducer;
