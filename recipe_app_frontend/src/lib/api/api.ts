import axios from "axios";
import { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      status: error.response?.status,
      response: error.response?.data,
    });

    // if (error.response?.status === 401) {
    //   const { store } = await import("@/redux/store");
    //   const { logoutUser } = await import("@/redux/features/auth/authThunks");

    //   store.dispatch(logoutUser());
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
