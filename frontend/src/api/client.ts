import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ??
      (Array.isArray(err.response?.data?.details)
        ? err.response.data.details.join(", ")
        : err.message);
    return Promise.reject(new Error(message));
  }
);
