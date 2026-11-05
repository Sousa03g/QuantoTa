import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { config } from "@/constants/config";

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/** Request interceptor — attach auth tokens or custom headers here */
api.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    return reqConfig;
  },
  (error: AxiosError) => Promise.reject(error),
);

/** Response interceptor — normalise errors */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        (error.response.data as { message?: string })?.message ??
        `Request failed with status ${status}`;

      console.error(`[API Error] ${status}: ${message}`);
    } else if (error.request) {
      console.error("[API Error] No response received:", error.message);
    } else {
      console.error("[API Error]", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
