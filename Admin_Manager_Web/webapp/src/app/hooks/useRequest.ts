import { App } from "antd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  getAllRequestsPaginated,
  GetAllRequestsPaginatedParams,
  getAllTodaysRequestsPaginated,
  GetAllTodaysRequestsPaginatedParams,
  getDetailsOfRequest,
  GetDetailsOfRequestParams,
  setCurrentRequest,
  setNewRequestList,
  setProcessingRequestList,
  setCompletedRequestList,
  setCanceledRequestList,
  setCurrentRequestList,
  setTodaysRequestList,
  getCurrentPriceOfRequest,
  updatePriceOfRequest,
  UpdatePriceOfRequestParams,
  setRequestValues,
} from "../redux/slice/requestSlice";

export function useRequest() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.request);
  const dispatch = useAppDispatch();

  const handleGetAllRequestPaginated = useCallback(
    async (value: GetAllRequestsPaginatedParams) => {
      const resultAction = await dispatch(getAllRequestsPaginated(value));
      if (getAllRequestsPaginated.fulfilled.match(resultAction)) {
        switch (value.Status) {
          case 0:
            dispatch(
              setNewRequestList({
                requests: resultAction.payload[0],
                total: resultAction.payload[1],
              }),
            );
            break;

          case 1:
            dispatch(
              setProcessingRequestList({
                requests: resultAction.payload[0],
                total: resultAction.payload[1],
              }),
            );
            break;

          case 2:
            dispatch(
              setCompletedRequestList({
                requests: resultAction.payload[0],
                total: resultAction.payload[1],
              }),
            );
            break;

          case 3:
            dispatch(
              setCanceledRequestList({
                requests: resultAction.payload[0],
                total: resultAction.payload[1],
              }),
            );
            break;

          default:
            dispatch(
              setCurrentRequestList({
                requests: resultAction.payload[0],
                total: resultAction.payload[1],
              }),
            );
        }
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

  const handleGetAllTodaysRequestsPaginated = useCallback(
    async (value: GetAllTodaysRequestsPaginatedParams) => {
      const resultAction = await dispatch(getAllTodaysRequestsPaginated(value));
      if (getAllTodaysRequestsPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setTodaysRequestList({
            requests: resultAction.payload.result,
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

  const handleGetDetailsOfRequest = useCallback(
    async (value: GetDetailsOfRequestParams) => {
      const resultAction = await dispatch(getDetailsOfRequest(value));
      if (getDetailsOfRequest.fulfilled.match(resultAction)) {
        dispatch(setCurrentRequest(resultAction.payload));
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

  const handleGetCurrentPriceOfRequest = useCallback(async () => {
    const resultAction = await dispatch(getCurrentPriceOfRequest());
    if (getCurrentPriceOfRequest.fulfilled.match(resultAction)) {
      dispatch(setRequestValues(resultAction.payload));
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
  }, [dispatch, notification]);

  const handleUpdatePriceOfRequest = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: UpdatePriceOfRequestParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(updatePriceOfRequest(values));
      if (updatePriceOfRequest.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Cập nhật giá yêu cầu thành công",
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

  return {
    state,
    handleGetAllRequestPaginated,
    handleGetAllTodaysRequestsPaginated,
    handleGetDetailsOfRequest,
    handleGetCurrentPriceOfRequest,
    handleUpdatePriceOfRequest,
  };
}
