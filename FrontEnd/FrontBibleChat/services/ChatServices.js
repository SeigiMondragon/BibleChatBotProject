import axios from "axios";

export const chatServices = {
  submitChat: async (prompt) => {
    const response = await axios.post("/api/chat", { prompt, history });
    return response.data;
  },
};
