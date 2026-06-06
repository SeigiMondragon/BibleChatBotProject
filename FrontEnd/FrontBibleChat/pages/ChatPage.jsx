import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { chatSchema } from "../src/features/chat/schemas/ChatSchema";
import BibleBotLogo2 from "@/assets/BibleBotLogo2.svg";
import { useParams } from "react-router-dom";
import ConversationComponent from "../src/features/chat/components/conversation-component";
import ChatForm from "../src/features/chat/components/chat-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useConversationMessagesQuery,
  useSubmitChatMutation,
} from "../src/features/chat/hooks/use-chat";

const ChatPage = () => {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(chatSchema),
  });
  const { convoID } = useParams();
  const [messages, setMessages] = useState([]);
  const [conversation_id, setConversation_id] = useState(null);
  const { data: conversationMessages, isPending: isConversationLoading } =
    useConversationMessagesQuery(convoID);
  const { mutateAsync: submitChat, isPending: isLoading } =
    useSubmitChatMutation();

  useEffect(() => {
    if (convoID) {
      setConversation_id(convoID);
    } else {
      newChat();
    }
  }, [convoID]);

  useEffect(() => {
    if (conversationMessages) {
      setMessages(conversationMessages);
    }
  }, [conversationMessages]);

  const onSubmit = async (data) => {
    const userMessage = data.prompt;
    console.log("userMessage", userMessage);
    if (!userMessage) return;
    const history = messages.map(({ role, message }) => ({
      role,
      content: message,
    }));
    console.log("history", history);
    setMessages((prev) => [...prev, { role: "user", message: userMessage }]);
    try {
      const response = await submitChat({
        prompt: userMessage,
        history,
        conversation_id,
      });
      const source = "\n\n**Source:** " + response?.sources.join(", ");
      setConversation_id(response?.conversation_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", message: `${response?.answer ?? ""}${source}` },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      reset();
    }
  };

  const newChat = async () => {
    setMessages([]);
    setConversation_id(null);
  };

  return (
    <>
      <div className="flex justify-between items-center shrink-0 bg-primary w-full p-3">
        <div className="flex items-center gap-3">
          <img
            src={BibleBotLogo2}
            alt="Bible Chat Bot"
            className="w-30 h-auto"
          />
        </div>
      </div>

      <div className="relative flex-1 min-h-0 flex overflow-hidden">
        <ConversationComponent messages={messages} isLoading={isLoading} />
        {isConversationLoading && convoID && (
          <div className="absolute inset-0 overflow-y-auto py-5 bg-white">
            <div className="mx-5 my-5">
              <Skeleton className="h-16 w-2/3 bg-secondary-foreground rounded-4xl" />
            </div>
            <div className="mx-5 my-5 flex justify-end ">
              <Skeleton className="h-16 w-1/2 bg-secondary rounded-4xl" />
            </div>
            <div className="mx-5 my-5">
              <Skeleton className="h-16 w-3/4 bg-secondary-foreground rounded-4xl" />
            </div>
            <div className="mx-3 my-5 flex justify-end ">
              <Skeleton className="h-16 w-1/2 bg-secondary rounded-4xl" />
            </div>
          </div>
        )}
      </div>
      <div className="shrink-0">
        <ChatForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default ChatPage;
