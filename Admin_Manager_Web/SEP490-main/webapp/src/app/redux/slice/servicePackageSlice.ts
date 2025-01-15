import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { excludedActionsPending } from "./specialUISlice";
import { UploadImage } from "../../components/image-upload/image-upload";
import { ServicePackage, TopServicePackage } from "../../models/service";

export type TServicePackage = {
  currentServicePackageList: {
    servicePackages: ServicePackage[];
    total: number;
  };
  currentServicePackage: ServicePackage;
  topServicePackageList: TopServicePackage[];
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TServicePackage = {
  currentServicePackageList: { servicePackages: [], total: 0 },
  currentServicePackage: {
    description: "",
    imageUrl: "",
    name: "",
    numOfRequest: 0,
    priceByDate: 0,
    servicePackageId: "",
    status: false,
    date: "",
    policy: "",
  },
  topServicePackageList: [],
  isFetching: false,
  isSending: false,
};

const servicePackageSlice = createSlice({
  name: "servicePackage",
  initialState,
  reducers: {
    setCurrentServicePackageList: (
      state,
      action: PayloadAction<TServicePackage["currentServicePackageList"]>,
    ) => {
      state.currentServicePackageList = action.payload;
    },
    setCurrentServicePackage: (
      state,
      action: PayloadAction<TServicePackage["currentServicePackage"]>,
    ) => {
      state.currentServicePackage = action.payload;
    },
    setTopServicePackageList: (
      state,
      action: PayloadAction<TServicePackage["topServicePackageList"]>,
    ) => {
      state.topServicePackageList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("servicePackage/fetch/") &&
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
          action.type.startsWith("servicePackage/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("servicePackage/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("servicePackage/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const getAllServicePackagePaginated = createAsyncThunk<
  any,
  GetAllServicePackagePaginatedParams
>(
  "servicePackage/fetch/getAllServicePackagePaginated",
  async (data, { rejectWithValue }) => {
    const { PageIndex, Pagesize, SearchByName, Status } = data;
    try {
      const response = await agent.ServicePackage.getAllServicePackagePaginated(
        {
          PageIndex,
          Pagesize,
          SearchByName,
          Status,
        },
      );
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

export const getServicePackage = createAsyncThunk<any, GetServicePackageParams>(
  "servicePackage/fetch/getServicePackage",
  async (data, { rejectWithValue }) => {
    const { ServicePackageId } = data;
    try {
      const response = await agent.ServicePackage.getServicePackage({
        ServicePackageId,
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

export const addServicePackage = createAsyncThunk<any, AddServicePackageParams>(
  "servicePackage/send/addServicePackage",
  async (data, { rejectWithValue }) => {
    const { Description, Image, Name, Price, NumOfRequest } = data;

    const formData = new FormData();
    formData.append("Description", Description);
    formData.append("Name", Name);
    formData.append("Price", Price.toString());
    formData.append("NumOfRequest", NumOfRequest.toString());
    formData.append("Image", Image as File);

    try {
      const response = await agent.ServicePackage.addServicePackage(formData);
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

export const updateServicePackage = createAsyncThunk<
  any,
  UpdateServicePackageParams
>(
  "servicePackage/send/updateServicePackage",
  async (data, { rejectWithValue }) => {
    const { ServicePackageId, Description, Image, Name, Price, NumOfRequest } =
      data;

    const formData = new FormData();
    formData.append("ServicePackageId", ServicePackageId);
    formData.append("Description", Description);
    formData.append("Name", Name);
    formData.append("Price", Price.toString());
    formData.append("NumOfRequest", NumOfRequest.toString());
    formData.append("Image", Image as File);

    try {
      const response =
        await agent.ServicePackage.updateServicePackage(formData);
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

export const disableServicePackage = createAsyncThunk<
  any,
  DisableServicePackageParams
>(
  "servicePackage/send/disableServicePackage",
  async (data, { rejectWithValue }) => {
    const { ServicePackageId, Status } = data;

    const formData = new FormData();
    formData.append("ServicePackageId", ServicePackageId);
    formData.append("Status", `${Status}`);

    try {
      const response =
        await agent.ServicePackage.disableServicePackage(formData);
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

export const getRevenueAndNumberOfPurchaseOfServicePackage = createAsyncThunk<
  any,
  GetRevenueAndNumberOfPurchaseOfServicePackageParams
>(
  "servicePackage/fetch/getRevenueAndNumberOfPurchaseOfServicePackage",
  async (data, { rejectWithValue }) => {
    const { NumOfTop, ServicePackageId } = data;
    try {
      const response =
        await agent.ServicePackage.getRevenueAndNumberOfPurchaseOfServicePackage(
          {
            NumOfTop,
            ServicePackageId,
          },
        );
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
  setCurrentServicePackageList,
  setCurrentServicePackage,
  setTopServicePackageList,
} = servicePackageSlice.actions;

export default servicePackageSlice.reducer;

export type GetAllServicePackagePaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByName?: string;
  Status?: boolean;
};

export type GetServicePackageParams = {
  ServicePackageId: string;
};

export type GetRevenueAndNumberOfPurchaseOfServicePackageParams = {
  NumOfTop: number;
  ServicePackageId: string;
};

export type AddServicePackageParams = {
  Name: string;
  Description: string;
  Image: UploadImage;
  NumOfRequest: number;
  Price: number;
};

export type UpdateServicePackageParams = {
  ServicePackageId: string;
  Name: string;
  Description: string;
  Image: UploadImage;
  NumOfRequest: number;
  Price: number;
};

export type DisableServicePackageParams = {
  ServicePackageId: string;
  Status: boolean;
};
