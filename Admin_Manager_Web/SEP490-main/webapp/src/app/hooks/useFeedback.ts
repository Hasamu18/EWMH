import { App } from "antd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  approveFeedback,
  ApproveFeedbackParams,
  getAllFeedbacksPaginated,
  GetAllFeedbacksPaginatedParams,
  getFeedbackDetails,
  GetFeedbackDetailsParams,
  setCurrentFeedback,
  setCurrentFeedbackList,
} from "../redux/slice/feedbackSlice";

export function useFeedback() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.feedback);
  const dispatch = useAppDispatch();

  const handleGetAllFeedbacksPaginated = useCallback(
    async (value: GetAllFeedbacksPaginatedParams) => {
      const resultAction = await dispatch(getAllFeedbacksPaginated(value));
      if (getAllFeedbacksPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentFeedbackList({
            feedbacks: resultAction.payload.results,
            total: resultAction.payload.count,
            averageRate: resultAction.payload.averageRate,
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

  const handleGetFeedbackDetails = useCallback(
    async (value: GetFeedbackDetailsParams) => {
      const resultAction = await dispatch(getFeedbackDetails(value));
      if (getFeedbackDetails.fulfilled.match(resultAction)) {
        dispatch(setCurrentFeedback(resultAction.payload));
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

  const handleApproveFeedback = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: ApproveFeedbackParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(approveFeedback(values));
      if (approveFeedback.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Duyệt đánh giá thành công",
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
    handleGetAllFeedbacksPaginated,
    handleGetFeedbackDetails,
    handleApproveFeedback,
  };
}
