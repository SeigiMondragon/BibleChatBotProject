import ax from "axios";

export const authServices = {
  login: async (email, password) => {
    const response = await ax.post("/api/auth/login", { email, password });
    const loginData = response.data;
    localStorage.setItem("token", loginData.token);
    return loginData;
  },
  register: async (email, username, password) => {
    const response = await ax.post("api/auth/register", {
      email,
      username,
      password,
    });
    return response.data;
  },
  logout: async () => {
    localStorage.removeItem("token");
  },
  getUser: async () => {
    const token = localStorage.getItem("token");
    ax.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await ax.get("api/auth/me");
    return response.data;
  },
};
