import ax from "axios";
import { AuthSchema } from "../schemas/AuthSchema";
import { RegisterSchema } from "../schemas/RegisterSchema";
import { LoginResponseSchema } from "../schemas/LoginResponseSchema";
import { RegisterResponseSchema } from "../schemas/RegisterResponseSchema";

export const authServices = {
  login: async (email, password) => {
    const response = await ax.post("/api/auth/login", { email, password });
    const loginData = response.data;

    return LoginResponseSchema.parse(loginData);
  },
  register: async (email, username, password) => {
    const response = await ax.post("/api/auth/register", {
      email,
      username,
      password,
    });
    const registerData = response.data;
    return RegisterResponseSchema.parse(registerData);
  },
  forgotPassword: async (email) => {
    const response = await ax.post("/api/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async ({ password, selector, token }) => {
    const response = await ax.post("/api/auth/reset-password", {
      password,
      selector,
      token,
    });
    return response.data;
  },
  logout: async () => {
    localStorage.removeItem("token");
  },
  getUser: async () => {
    const response = await ax.get("api/auth/me");
    return response.data?.user ?? null;
  },
};
