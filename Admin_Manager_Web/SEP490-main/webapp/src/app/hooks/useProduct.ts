import { App } from "antd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  addProduct,
  AddProductParams,
  disableProduct,
  DisableProductParams,
  getAllProductPaginated,
  GetAllProductPaginatedParams,
  getProduct,
  GetProductParams,
  getRevenueAndNumberOfPurchaseOfProduct,
  GetRevenueAndNumberOfPurchaseOfProductParams,
  setCurrentProduct,
  setCurrentProductList,
  setTopProductList,
  updateProduct,
  UpdateProductParams,
} from "../redux/slice/productSlice";

export function useProduct() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();

  const handleGetAllProductPaginated = useCallback(
    async (value: GetAllProductPaginatedParams) => {
      const resultAction = await dispatch(getAllProductPaginated(value));
      if (getAllProductPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentProductList({
            products: resultAction.payload.results,
            total: resultAction.payload.count,
          }),
        );
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleGetProduct = useCallback(
    async (value: GetProductParams) => {
      const resultAction = await dispatch(getProduct(value));
      if (getProduct.fulfilled.match(resultAction)) {
        dispatch(setCurrentProduct(resultAction.payload));
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleAddProduct = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: AddProductParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(addProduct(values));
      if (addProduct.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Tạo sản phẩm thành công",
          placement: "topRight",
        });
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleUpdateProduct = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: UpdateProductParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(updateProduct(values));
      if (updateProduct.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Cập nhật sản phẩm thành công",
          placement: "topRight",
        });
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleDisableProduct = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: DisableProductParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(disableProduct(values));
      if (disableProduct.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Cập nhật sản phẩm thành công",
          placement: "topRight",
        });
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleGetRevenueAndNumberOfPurchaseOfProduct = useCallback(
    async (values: GetRevenueAndNumberOfPurchaseOfProductParams) => {
      const resultAction = await dispatch(
        getRevenueAndNumberOfPurchaseOfProduct(values),
      );
      if (
        getRevenueAndNumberOfPurchaseOfProduct.fulfilled.match(resultAction)
      ) {
        dispatch(setTopProductList(resultAction.payload[0]));
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  return {
    state,
    handleGetAllProductPaginated,
    handleAddProduct,
    handleUpdateProduct,
    handleGetProduct,
    handleDisableProduct,
    handleGetRevenueAndNumberOfPurchaseOfProduct,
  };
}
