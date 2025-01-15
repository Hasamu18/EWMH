import { App } from "antd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  approveCustomerAccount,
  ApproveCustomerAccountParams,
  assignWorkerToLeader,
  AssignWorkerToLeaderParams,
  createPersonnelAccount,
  CreatePersonnelAccountParams,
  disableUser,
  DisableUserParams,
  getAllAccountPaginated,
  GetAllAccountPaginatedParams,
  getAllLeaderPaginated,
  getAllFreeLeaders,
  GetAllLeaderPaginatedParams,
  getAllPendingAccountPaginated,
  GetAllPendingAccountPaginatedParams,
  getAllWorkerPaginated,
  GetAllWorkerPaginatedParams,
  setCurrentLeaderList,
  setCurrentPendingAccountList,
  setCurrentUserList,
  setCurrentWorkerList,
  setFreeLeaderList,
  getAllLeaderPaginatedExcluded,
  getAllWorkerFromLeader,
  GetAllWorkerFromLeaderParams,
  setWorkerOfLeaderList,
} from "../redux/slice/accountSlice";

export function useAccount() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();

  const handleGetAllAccountPaginated = useCallback(
    async (value: GetAllAccountPaginatedParams) => {
      const resultAction = await dispatch(getAllAccountPaginated(value));
      if (getAllAccountPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentUserList({
            users: resultAction.payload[0],
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

  const handleGetAllPendingAccountPaginated = useCallback(
    async (value: GetAllPendingAccountPaginatedParams) => {
      const resultAction = await dispatch(getAllPendingAccountPaginated(value));
      if (getAllPendingAccountPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentPendingAccountList({
            users: resultAction.payload[0],
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

  const handleGetAllWorkerPaginated = useCallback(
    async (value: GetAllWorkerPaginatedParams) => {
      const resultAction = await dispatch(getAllWorkerPaginated(value));
      if (getAllWorkerPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentWorkerList({
            users: resultAction.payload[0],
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

  const handleGetAllLeaderPaginated = useCallback(
    async (value: GetAllLeaderPaginatedParams) => {
      const resultAction = await dispatch(getAllLeaderPaginated(value));
      if (getAllLeaderPaginated.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentLeaderList({
            users: resultAction.payload[0],
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

  const handleGetAllLeaderPaginatedExcluded = useCallback(
    async (value: GetAllLeaderPaginatedParams) => {
      dispatch(setCurrentLeaderList({ users: [], total: 0 }));
      const resultAction = await dispatch(getAllLeaderPaginatedExcluded(value));
      if (getAllLeaderPaginatedExcluded.fulfilled.match(resultAction)) {
        dispatch(
          setCurrentLeaderList({
            users: resultAction.payload[0],
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

  const handleGetAllFreeLeaders = useCallback(async () => {
    dispatch(setCurrentLeaderList({ users: [], total: 0 }));
    const resultAction = await dispatch(getAllFreeLeaders());
    if (getAllFreeLeaders.fulfilled.match(resultAction)) {
      dispatch(
        setFreeLeaderList({
          users: resultAction.payload,
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
  }, [dispatch, notification]);

  const handleGetAllWorkerFromLeader = useCallback(
    async (values: GetAllWorkerFromLeaderParams) => {
      const resultAction = await dispatch(getAllWorkerFromLeader(values));
      if (getAllWorkerFromLeader.fulfilled.match(resultAction)) {
        dispatch(
          setWorkerOfLeaderList({
            users: resultAction.payload,
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

  const handleCreatePersonnelAccount = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: CreatePersonnelAccountParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(createPersonnelAccount(values));
      if (createPersonnelAccount.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Tạo tài khoản thành công",
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

  const handleDisableUser = useCallback(
    async (value: DisableUserParams) => {
      const resultAction = await dispatch(disableUser(value));
      if (disableUser.fulfilled.match(resultAction)) {
        notification.success({
          message: "Success",
          description: value.disable
            ? "Vô hiệu hóa tài khoản thành công"
            : "Kích hoạt tài khoản thành công",
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

  const handleAssignWorkerToLeader = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: AssignWorkerToLeaderParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(assignWorkerToLeader(values));
      if (assignWorkerToLeader.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Chuyển trưởng nhóm thành công",
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

  const handleApproveCustomerAccount = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: ApproveCustomerAccountParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(approveCustomerAccount(values));
      if (approveCustomerAccount.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        switch (values.isApproval) {
          case true:
            notification.success({
              message: "Success",
              description: "Duyệt tài khoản thành công",
              placement: "topRight",
            });
            break;

          case false:
            notification.success({
              message: "Success",
              description: "Từ chối duyệt tài khoản thành công",
              placement: "topRight",
            });
            break;

          default:
            break;
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

  return {
    state,
    handleGetAllAccountPaginated,
    handleGetAllLeaderPaginated,
    handleGetAllLeaderPaginatedExcluded,
    handleGetAllWorkerPaginated,
    handleGetAllPendingAccountPaginated,
    handleCreatePersonnelAccount,
    handleDisableUser,
    handleAssignWorkerToLeader,
    handleGetAllFreeLeaders,
    handleApproveCustomerAccount,
    handleGetAllWorkerFromLeader,
  };
}
