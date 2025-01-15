import { App } from "antd";
import { jwtDecode } from "jwt-decode";
import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  getAccountInfo,
  login,
  LoginParams,
  logout,
  resetPassword,
  ResetPasswordParams,
  sendPasswordResetLink,
  SendPasswordResetLinkParams,
  setCurrentUser,
} from "../redux/slice/authSlice";
import { ROLE } from "../../constants/role";

export function useAuth() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogin = useCallback(
    async (value: LoginParams, navigate: NavigateFunction) => {
      const resultAction = await dispatch(login(value));
      if (login.fulfilled.match(resultAction)) {
        const { at, rt } = resultAction.payload;
        if (at && rt) {
          const decode = jwtDecode(at) as any;
          if (![ROLE.admin, ROLE.manager].includes(decode.role)) {
            notification.error({
              message: "Lỗi",
              description: "Tài khoản không có quyền truy cập",
              placement: "topRight",
            });
          } else {
            localStorage.setItem("access_token", at);
            localStorage.setItem("refresh_token", rt);
            dispatch(setCurrentUser(decode));
            navigate("/");
          }
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

  const handleSendPasswordResetLink = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: SendPasswordResetLinkParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(sendPasswordResetLink(values));
      if (sendPasswordResetLink.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description:
            "Gửi yêu cầu thành công. Vui lòng kiểm tra email để tiếp tục.",
          placement: "topRight",
        });
      } else {
        console.log(resultAction);
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

  const handleResetPassword = useCallback(
    async ({
      values,
      callBackFn,
    }: {
      values: ResetPasswordParams;
      callBackFn?: () => void;
    }) => {
      const resultAction = await dispatch(resetPassword(values));
      if (resetPassword.fulfilled.match(resultAction)) {
        if (callBackFn) {
          callBackFn();
        }
        notification.success({
          message: "Success",
          description: "Đổi mật khẩu thành công",
          placement: "topRight",
        });
      } else {
        console.log(resultAction);
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

  const handleGetAccountInfo = useCallback(async () => {
    const resultAction = await dispatch(getAccountInfo());
    if (getAccountInfo.fulfilled.match(resultAction)) {
      dispatch(setCurrentUser(resultAction.payload));
    } else {
      console.log(resultAction);
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

  const handleLogout = useCallback(async () => {
    const resultAction = await dispatch(logout());
    if (logout.fulfilled.match(resultAction)) {
      localStorage.clear();
      window.location.href = "/login";
    } else {
      if (resultAction.payload) {
        console.log(resultAction);
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

  return {
    state,
    handleLogin,
    handleLogout,
    handleGetAccountInfo,
    handleSendPasswordResetLink,
    handleResetPassword,
  };
}
