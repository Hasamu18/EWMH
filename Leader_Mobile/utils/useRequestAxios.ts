import axios from "axios";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";


const useAxios = () => {
  const [error, setError] = useState("");
  let controller = new AbortController();

  const axiosInstance = axios.create({
    baseURL: "https://ewmhrequest.azurewebsites.net/api",
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    return () => controller?.abort();
  }, []);

  type Method = "GET" | "POST" | "PUT" | "DELETE";

  interface FetchDataParams {
    url: string;
    method: Method;
    data?: object;
    params?: object;
    header?: object
  }

  const fetchData = async ({
    url,
    method,
    data = {},
    params = {},
    header = {}
  }: FetchDataParams) => {

    controller.abort();
    controller = new AbortController();

    const accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        signal: controller.signal,
        headers: {
          ...header,
          Authorization: `Bearer ${accessToken}`,
        },
      });      
      return result.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request cancelled", error.message);
      } else {
        setError(error.response ? error.response.data : error.message);
      }
      return null; 
    }
  };

  return { fetchData, error, setError };
};

export default useAxios;
