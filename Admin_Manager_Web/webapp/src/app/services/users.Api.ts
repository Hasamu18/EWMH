import axios, { AxiosError, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import agent from "./agent";
import { Envs } from "../utils/env";
import { baseRequests } from "./baseApi";

NProgress.configure({ showSpinner: false });

const baseURL = Envs.api_user;
const timeout = 60 * 1000;

const responseBody = (response: AxiosResponse) => response.data;

const userApi = axios.create({
  baseURL,
  timeout: timeout,
  // signal: AbortSignal.timeout(timeout),
  // withCredentials: true,
});

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

let refreshTokenPromise: Promise<any> | null = null;

userApi.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (token) {
    const decodeToken = jwtDecode(token) as { exp: number };
    const currentTime = Date.now() / 1000;

    if (decodeToken.exp < currentTime) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = agent.Account.refreshToken({
          at: token,
          rt: refreshToken,
        })
          .then((data) => {
            localStorage.setItem("access_token", data.at);
            localStorage.setItem("refresh_token", data.rt);
            refreshTokenPromise = null;
            return data;
          })
          .catch((error) => {
            refreshTokenPromise = null;
            if (error instanceof AxiosError) {
              if (error.response?.status === 400) {
                throw error;
              }
            }
            localStorage.clear();
            window.location.href = "/login";
          });
      }

      const data = await refreshTokenPromise;
      config.headers["Authorization"] = `Bearer ${data.at}`;
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  NProgress.start();
  return config;
});

userApi.interceptors.response.use(
  async (response) => {
    await sleep();
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    if (["ECONNABORTED"].includes(error.code)) {
      const reformatError = new AxiosError(
        "Connection Timeout.", // New error message
        error.code,
        error.config,
        error.request,
        error.response,
      );
      reformatError.stack = error.stack; // Preserve stack trace

      return Promise.reject(reformatError);
    }
    if (error.response && [401].includes(error.response.status)) {
      localStorage.clear();
      window.location.href = "/login";
    }
    if (
      error.response &&
      error.response.data.errors &&
      [400].includes(error.response.status)
    ) {
      const reformatError = new AxiosError(
        Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`,
          )
          .join("; "),
        error.code,
        error.config,
        error.request,
      );
      reformatError.stack = error.stack;

      return Promise.reject(reformatError);
    }
    return Promise.reject(error);
  },
);

const userRequests = {
  get: <T>(url: string, params?: T) =>
    userApi.get(url, { params }).then(responseBody),
  post: <T>(url: string, body: T) => userApi.post(url, body).then(responseBody),
  put: <T>(url: string, body: T) => userApi.put(url, body).then(responseBody),
  patch: <T>(url: string, body: T) =>
    userApi.patch(url, body).then(responseBody),
  del: <T>(url: string, params?: T) =>
    userApi.delete(url, { params }).then(responseBody),
};

const baseUserRequests = baseRequests(baseURL);

export { userRequests, baseUserRequests };
