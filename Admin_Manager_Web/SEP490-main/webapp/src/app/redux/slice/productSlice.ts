import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "../../services/agent";
import { AxiosError } from "axios";
import { excludedActionsPending } from "./specialUISlice";
import { Product, TopProduct } from "../../models/product";
import { UploadImage } from "../../components/image-upload/image-upload";

export type TProduct = {
  currentProductList: { products: Product[]; total: number };
  currentProduct: Product;
  topProductList: TopProduct[];
  isFetching: boolean;
  isSending: boolean;
};

const initialState: TProduct = {
  currentProductList: { products: [], total: 0 },
  currentProduct: {
    imageUrl: "",
    inOfStock: 0,
    name: "",
    priceByDate: 0,
    productId: "",
    status: false,
    date: "",
    description: "",
    productPriceId: "",
    warantyMonths: undefined,
  },
  topProductList: [],
  isFetching: false,
  isSending: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCurrentProductList: (
      state,
      action: PayloadAction<TProduct["currentProductList"]>,
    ) => {
      state.currentProductList = action.payload;
    },
    setCurrentProduct: (
      state,
      action: PayloadAction<TProduct["currentProduct"]>,
    ) => {
      state.currentProduct = action.payload;
    },
    setTopProductList: (
      state,
      action: PayloadAction<TProduct["topProductList"]>,
    ) => {
      state.topProductList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("product/fetch/") &&
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
          action.type.startsWith("product/send/") &&
          action.type.endsWith("/pending") &&
          !excludedActionsPending.includes(action.type),
        (state) => {
          return { ...state, isSending: true };
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("product/send/") &&
          action.type.endsWith("/fulfilled"),
        () => {
          return { ...initialState };
        },
      );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("product/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.isFetching = false;
        state.isSending = false;
      },
    );
  },
});

export const getAllProductPaginated = createAsyncThunk<
  any,
  GetAllProductPaginatedParams
>("product/fetch/getAllProductPaginated", async (data, { rejectWithValue }) => {
  const { PageIndex, Pagesize, IncreasingPrice, SearchByName, Status } = data;
  try {
    const response = await agent.Product.getAllProductPaginated({
      PageIndex,
      Pagesize,
      IncreasingPrice,
      SearchByName,
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
});

export const getProduct = createAsyncThunk<any, GetProductParams>(
  "product/fetch/getProduct",
  async (data, { rejectWithValue }) => {
    const { ProductId } = data;
    try {
      const response = await agent.Product.getProduct({
        ProductId,
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

export const addProduct = createAsyncThunk<any, AddProductParams>(
  "product/send/addProduct",
  async (data, { rejectWithValue }) => {
    const { Description, Image, Name, Price, InOfStock, WarantyMonths } = data;

    const formData = new FormData();
    formData.append("Description", Description);
    formData.append("Name", Name);
    formData.append("Price", Price.toString());
    formData.append("InOfStock", InOfStock.toString());
    formData.append("WarantyMonths", WarantyMonths.toString());
    formData.append("Image", Image as File);

    try {
      const response = await agent.Product.addProduct(formData);
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

export const updateProduct = createAsyncThunk<any, UpdateProductParams>(
  "product/send/updateProduct",
  async (data, { rejectWithValue }) => {
    const {
      ProductId,
      Description,
      Image,
      Name,
      Price,
      InOfStock,
      WarantyMonths,
    } = data;

    const formData = new FormData();
    formData.append("ProductId", ProductId);
    formData.append("Description", Description);
    formData.append("Name", Name);
    formData.append("Price", Price.toString());
    formData.append("InOfStock", InOfStock.toString());
    formData.append("WarantyMonths", WarantyMonths.toString());
    formData.append("Image", Image as File);

    try {
      const response = await agent.Product.updateProduct(formData);
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

export const disableProduct = createAsyncThunk<any, DisableProductParams>(
  "product/send/disableProduct",
  async (data, { rejectWithValue }) => {
    const { ProductId, Status } = data;

    const formData = new FormData();
    formData.append("ProductId", ProductId);
    formData.append("Status", `${Status}`);

    try {
      const response = await agent.Product.disableProduct(formData);
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

export const getRevenueAndNumberOfPurchaseOfProduct = createAsyncThunk<
  any,
  GetRevenueAndNumberOfPurchaseOfProductParams
>(
  "product/fetch/getRevenueAndNumberOfPurchaseOfProduct",
  async (data, { rejectWithValue }) => {
    const { NumOfTop, ProductId } = data;
    try {
      const response =
        await agent.Product.getRevenueAndNumberOfPurchaseOfProduct({
          NumOfTop,
          ProductId,
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

export const { setCurrentProductList, setCurrentProduct, setTopProductList } =
  productSlice.actions;

export default productSlice.reducer;

export type GetAllProductPaginatedParams = {
  PageIndex: number;
  Pagesize: number;
  SearchByName?: string;
  IncreasingPrice?: boolean;
  Status?: boolean;
};

export type GetProductParams = {
  ProductId: string;
};

export type GetRevenueAndNumberOfPurchaseOfProductParams = {
  NumOfTop: number;
  ProductId: string;
};

export type AddProductParams = {
  Name: string;
  Description: string;
  Image: UploadImage;
  InOfStock: number;
  WarantyMonths: number;
  Price: number;
};

export type UpdateProductParams = {
  ProductId: string;
  Name: string;
  Description: string;
  Image: UploadImage;
  InOfStock: number;
  WarantyMonths: number;
  Price: number;
};

export type DisableProductParams = {
  ProductId: string;
  Status: boolean;
};
