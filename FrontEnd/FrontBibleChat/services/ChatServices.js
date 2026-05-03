import axios from "axios";
import { get } from "react-hook-form";

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
  getConversationName: async () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(`api/conversationNames`);
    return response.data;
  },
  getConversationMessages: async (conversation_id) => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `api/conversationMessages/${conversation_id}`,
    );
    return response.data;
  },
};
