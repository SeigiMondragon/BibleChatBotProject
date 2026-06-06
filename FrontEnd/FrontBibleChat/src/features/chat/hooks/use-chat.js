import { useMutation, useQuery } from "@tanstack/react-query";
import { chatServices } from "../api/chat-api";

export function useConversationNamesQuery() {
  return useQuery({
    queryKey: ["conversation-names"],
    queryFn: chatServices.getConversationName,
  });
}

export function useConversationMessagesQuery(conversationId) {
  return useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () => chatServices.getConversationMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function useSearchConversationsQuery(query) {
  return useQuery({
    queryKey: ["search-conversations", query],
    queryFn: () => chatServices.searchConversationByName(query),
    enabled: !!query,
  });
}

export function useSubmitChatMutation() {
  return useMutation({
    mutationFn: ({ prompt, history, conversation_id }) =>
      chatServices.submitChat(prompt, history, conversation_id),
  });
}
