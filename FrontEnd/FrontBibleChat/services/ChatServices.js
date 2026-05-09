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
  getConversationName: async () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(`/api/conversationNames`);
    return response.data;
  },
  getConversationMessages: async (conversation_id) => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `/api/conversationMessages/${conversation_id}`,
    );
    return response.data;
  },
  searchConversationByName: async (query) => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get("/api/conversationNameByName", {
      params: { query },
    });
    return response.data;
  },
};
