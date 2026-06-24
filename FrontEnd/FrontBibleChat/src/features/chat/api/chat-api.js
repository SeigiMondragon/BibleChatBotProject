import ax from "@/lib/axios";

export const chatServices = {
  submitChat: async (prompt, history, conversation_id) => {
    const token = localStorage.getItem("token");
    ax.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await ax.post("/api/chat", {
      prompt,
      history,
      conversation_id,
    });
    return response.data;
  },
  getConversationName: async () => {
    const token = localStorage.getItem("token");
    ax.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await ax.get(`/api/conversationNames`);
    return response.data;
  },
  getConversationMessages: async (conversation_id) => {
    const token = localStorage.getItem("token");
    ax.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await ax.get(
      `/api/conversationMessages/${conversation_id}`,
    );
    return response.data;
  },
  searchConversationByName: async (query) => {
    const token = localStorage.getItem("token");
    ax.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await ax.get("/api/conversationNameByName", {
      params: { query },
    });
    return response.data;
  },
};
