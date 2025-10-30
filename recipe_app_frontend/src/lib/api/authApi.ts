import { User } from "@/redux/features/auth/authTypes";
import axios from "axios";
export const authApi = {
  createProfile: async (): Promise<User> => {
    const res = await axios.post("/api/auth/register");
    return res.data.data;
  },
  loginUser: async (): Promise<User> => {
    const res = await axios.post("/api/auth/login");
    return res.data.data;
  },

  getUserProfile: async (): Promise<User> => {
    const res = await axios.get("/api/auth/user");
    return res.data.data;
  },
};
