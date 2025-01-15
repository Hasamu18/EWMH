import { App } from "antd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  addServicePackage,
  AddServicePackageParams,
  disableServicePackage,
  DisableServicePackageParams,
  getAllServicePackagePaginated,
  GetAllServicePackagePaginatedParams,
  getRevenueAndNumberOfPurchaseOfServicePackage,
  GetRevenueAndNumberOfPurchaseOfServicePackageParams,
  getServicePackage,
  GetServicePackageParams,
  setCurrentServicePackage,
  setCurrentServicePackageList,
  setTopServicePackageList,
  updateServicePackage,
  UpdateServicePackageParams,
} from "../redux/slice/servicePackageSlice";

export function useServicePackage() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.servicePackage);
  const dispatch = useAppDispatch();

  const handleGetAllServicePackagePaginated = useCallback(
    async (value: GetAllServicePackagePaginatedParams) => {
      const resultAction = await dispatch(getAllServicePackagePaginated(value));
      if (getAllServicePackagePaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentServicePackageList({
            servicePackages: resultAction.payload[0],
            total: resultAction.payload[1],
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

  const handleGetServicePackage = useCallback(
    async (value: GetServicePackageParams) => {
      const resultAction = await dispatch(getServicePackage(value));
      if (getServicePackage.fulfilled.match(resultAction)) {
        dispatch(setCurrentServicePackage(resultAction.payload));
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

  const handleAddServicePackage = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: AddServicePackageParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(addServicePackage(values));
      if (addServicePackage.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Tạo gói dịch vụ thành công",
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

  const handleUpdateServicePackage = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: UpdateServicePackageParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(updateServicePackage(values));
      if (updateServicePackage.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Cập nhật gói dịch vụ thành công",
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

  const handleDisableServicePackage = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: DisableServicePackageParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(disableServicePackage(values));
      if (disableServicePackage.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Cập nhật gói dịch vụ thành công",
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

  const handleGetRevenueAndNumberOfPurchaseOfServicePackage = useCallback(
    async (values: GetRevenueAndNumberOfPurchaseOfServicePackageParams) => {
      const resultAction = await dispatch(
        getRevenueAndNumberOfPurchaseOfServicePackage(values),
      );
      if (
        getRevenueAndNumberOfPurchaseOfServicePackage.fulfilled.match(
          resultAction,
        )
      ) {
        dispatch(setTopServicePackageList(resultAction.payload[0]));
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
    handleGetAllServicePackagePaginated,
    handleAddServicePackage,
    handleUpdateServicePackage,
    handleGetServicePackage,
    handleDisableServicePackage,
    handleGetRevenueAndNumberOfPurchaseOfServicePackage,
  };
}
