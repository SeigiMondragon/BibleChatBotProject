import axios from "axios";

export const chatServices = {
  submitChat: async (prompt) => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.post("/api/chat", { prompt, history });
    return response.data;
  },
};
