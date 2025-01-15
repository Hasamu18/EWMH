import { App } from "antd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  getAllOrderPaginated,
  GetAllOrderPaginatedParams,
  getAllRequestOrdersPaginated,
  getOrderDetails,
  GetOrderParams,
  GetTodaysOrderPaginatedParams,
  getTodaysOrdersPaginated,
  setCurrentOrder,
  setCurrentOrderList,
  setCurrentRequestOrderList,
  setTodaysOrderList,
} from "../redux/slice/orderSlice";

export function useOrder() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  const handleGetAllOrderPaginated = useCallback(
    async (value: GetAllOrderPaginatedParams) => {
      const resultAction = await dispatch(getAllOrderPaginated(value));
      if (getAllOrderPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentOrderList({
            orders: resultAction.payload.result,
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

  const handleGetTodaysOrderPaginated = useCallback(
    async (value: GetTodaysOrderPaginatedParams) => {
      const resultAction = await dispatch(getTodaysOrdersPaginated(value));
      if (getTodaysOrdersPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setTodaysOrderList({
            orders: resultAction.payload.result,
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

  const handleGetAllRequestOrderPaginated = useCallback(
    async (value: GetAllOrderPaginatedParams) => {
      const resultAction = await dispatch(getAllRequestOrdersPaginated(value));
      if (getAllRequestOrdersPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentRequestOrderList({
            orders: resultAction.payload.result,
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

  const handleGetOrder = useCallback(
    async (value: GetOrderParams) => {
      const resultAction = await dispatch(getOrderDetails(value));
      if (getOrderDetails.fulfilled.match(resultAction)) {
        dispatch(setCurrentOrder(resultAction.payload));
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
    handleGetAllOrderPaginated,
    handleGetOrder,
    handleGetAllRequestOrderPaginated,
    handleGetTodaysOrderPaginated,
  };
}
