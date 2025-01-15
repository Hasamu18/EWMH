import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { excludedActionsPending } from "./specialUISlice";
import { Apartment } from "../../models/apartment";
import { UploadImage } from "../../components/image-upload/image-upload";
import { Room } from "../../models/room";

export type TApartment = {
  currentApartmentList: { apartments: Apartment[]; total: number };
  currentApartment: Apartment;
  currentRoomList: { rooms: Room[]; total: number };
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TApartment = {
  currentApartmentList: { apartments: [], total: 0 },
  currentApartment: {
    account: {
      accountId: "",
      avatarUrl: "",
      dateOfBirth: "",
      disabledReason: "",
      email: "",
      fullName: "",
      isDisabled: false,
      phoneNumber: "",
      role: "",
    },
    address: "",
    areaId: "",
    avatarUrl: "",
    description: "",
    leaderId: "",
    managementCompany: "",
    name: "",
    roomIds: [],
  },
  currentRoomList: { rooms: [], total: 0 },
  isFetching: false,
  isSending: false,
};

const apartmentSlice = createSlice({
  name: "apartment",
  initialState,
  reducers: {
    setCurrentApartmentList: (
      state,
      action: PayloadAction<TApartment["currentApartmentList"]>,
    ) => {
      state.currentApartmentList = action.payload;
    },
    setCurrentApartment: (
      state,
      action: PayloadAction<TApartment["currentApartment"]>,
    ) => {
      state.currentApartment = action.payload;
    },
    setCurrentRoomList: (
      state,
      action: PayloadAction<TApartment["currentRoomList"]>,
    ) => {
      state.currentRoomList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("apartment/fetch/") &&
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
          action.type.startsWith("apartment/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("apartment/send/") &&
          action.type.endsWith("/fulfilled") &&
          ![
            "apartment/send/addRooms/fulfilled",
            "apartment/send/updateRoom/fulfilled",
          ].includes(action.type),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("apartment/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const getAllApartmentPaginated = createAsyncThunk<
  any,
  GetAllApartmentPaginatedParams
>(
  "apartment/fetch/getAllApartmentPaginated",
  async (data, { rejectWithValue }) => {
    const { PageIndex, Pagesize, SearchByName } = data;
    try {
      const response = await agent.Apartment.getAllApartmentPaginated({
        PageIndex,
        Pagesize,
        SearchByName,
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

export const getAllRoomPaginated = createAsyncThunk<
  any,
  GetAllRoomPaginatedParams
>("apartment/fetch/getAllRoomPaginated", async (data, { rejectWithValue }) => {
  const { AreaId, PageIndex, Pagesize } = data;
  try {
    const response = await agent.Apartment.getAllRoomPaginated({
      AreaId,
      PageIndex,
      Pagesize,
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

export const addRooms = createAsyncThunk<any, AddRoomsParams>(
  "apartment/send/addRooms",
  async (data, { rejectWithValue }) => {
    const { areaId, roomIds } = data;
    try {
      if (roomIds.length === 0) {
        return rejectWithValue("Chưa chọn căn hộ");
      }
      const response = await agent.Apartment.addRooms({
        areaId,
        roomIds,
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

export const updateRoom = createAsyncThunk<any, UpdateRoomParams>(
  "apartment/send/updateRoom",
  async (data, { rejectWithValue }) => {
    const { areaId, newRoomId, oldRoomId } = data;
    try {
      const response = await agent.Apartment.updateRoom({
        areaId,
        newRoomId,
        oldRoomId,
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

export const addApartment = createAsyncThunk<any, AddApartmentParams>(
  "apartment/send/addApartment",
  async (data, { rejectWithValue }) => {
    const { Description, Image, Name, Address, LeaderId, ManagementCompany } =
      data;

    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("Description", Description);
    formData.append("Address", Address);
    formData.append("ManagementCompany", ManagementCompany);
    formData.append("Image", Image as File);
    formData.append("LeaderId", LeaderId);

    try {
      const response = await agent.Apartment.addApartment(formData);
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

export const updateApartment = createAsyncThunk<any, UpdateApartmentParams>(
  "apartment/send/updateApartment",
  async (data, { rejectWithValue }) => {
    const {
      Description,
      Image,
      Name,
      Address,
      AreaId,
      LeaderId,
      ManagementCompany,
    } = data;

    const formData = new FormData();
    formData.append("AreaId", AreaId);
    formData.append("Name", Name);
    formData.append("Description", Description);
    formData.append("Address", Address);
    formData.append("ManagementCompany", ManagementCompany);
    formData.append("Image", Image as File);
    formData.append("LeaderId", LeaderId);

    try {
      const response = await agent.Apartment.updateApartment(formData);
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
  setCurrentApartmentList,
  setCurrentApartment,
  setCurrentRoomList,
} = apartmentSlice.actions;

export default apartmentSlice.reducer;

export type GetAllApartmentPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByName?: string;
};

export type GetAllRoomPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  AreaId: string;
};

export type AddApartmentParams = {
  Name: string;
  Description: string;
  Address: string;
  ManagementCompany: string;
  Image: UploadImage;
  LeaderId: string;
};

export type AddRoomsParams = {
  areaId: string;
  roomIds: string[];
};

export type UpdateApartmentParams = {
  AreaId: string;
  Name: string;
  Description: string;
  Address: string;
  ManagementCompany: string;
  Image: UploadImage;
  LeaderId: string;
};

export type UpdateRoomParams = {
  areaId: string;
  oldRoomId: string;
  newRoomId: string;
};
