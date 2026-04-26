import axios from "axios";

export const chatServices = {
  submitChat: async (prompt, history, conversation_id) => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.post("/api/chat", {
      prompt,
      history,
      conversation_id,
    });
    return response.data;
  },
};
