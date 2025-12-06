import { User } from "@/redux/features/auth/authTypes";
import api from "./api";

export const authApi = {
  createProfile: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    const res = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return {
      user: res.data,
      token: res.data.token,
    };
  },

  googleLogin: async (
    token: string
  ): Promise<{ user: User; token?: string }> => {
    const res = await api.post("/api/auth/google", { token });
    return res.data;
  },

  loginUser: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    const res = await api.post("/api/auth/login", credentials);
    return {
      user: res.data,
      token: res.data.token,
    };
  },

  logoutUser: async () => {
    const res = await api.post("/api/auth/logout");
    return res.data;
  },

  getUserProfile: async (token?: string): Promise<User> => {
    const res = await api.get("/api/auth/user", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },
};
