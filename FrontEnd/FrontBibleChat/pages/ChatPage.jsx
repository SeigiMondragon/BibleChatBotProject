import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { chatSchema } from "../src/features/chat/schemas/ChatSchema";
import { chatServices } from "../src/features/chat/api/chat-api";
import BibleBotLogo2 from "@/assets/BibleBotLogo2.svg";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSideBar } from "@/components/custom/chatSidebar";
import { useAuth } from "../src/hooks/useAuth";
import { useParams } from "react-router-dom";
import ConversationComponent from "../src/features/chat/components/conversation-component";
import ChatForm from "../src/features/chat/components/chat-form";

const RECENT_CHATS_KEY = "recent_chats";

const ChatPage = () => {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(chatSchema),
  });
  const { convoID } = useParams();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [conversation_id, setConversation_id] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const savedRecentChats = JSON.parse(
        localStorage.getItem(RECENT_CHATS_KEY) ?? "[]",
      );
      if (Array.isArray(savedRecentChats)) {
        setRecentChats(savedRecentChats);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (convoID) {
      selectRecentChat(convoID);
      setConversation_id(convoID);
    } else {
      newChat();
    }
  }, [convoID]);

  const saveRecentChat = (chatText) => {
    const normalizedChat = chatText.trim();
    if (!normalizedChat) return;

    setRecentChats((prev) => {
      const nextRecentChats = [
        normalizedChat,
        ...prev.filter((chat) => chat !== normalizedChat),
      ].slice(0, 30);

      localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(nextRecentChats));
    });
  };

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
      setIsLoading(true);
      const response = await chatServices.submitChat(
        userMessage,
        history,
        conversation_id,
      );
      const source = "\n\n**Source:** " + response?.sources.join(", ");
      setConversation_id(response?.conversation_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", message: `${response?.answer ?? ""}${source}` },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  const newChat = async () => {
    setMessages([]);
    setConversation_id(null);
    setHistory([]);
  };

  const selectRecentChat = async (conversation_id) => {
    try {
      setConversation_id(conversation_id);
      const response =
        await chatServices.getConversationMessages(conversation_id);
      setMessages(response);
      console.log("This is the response", response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full h-screen ">
      <SidebarProvider>
        <section>
          <ChatSideBar onNewChat={newChat} />
        </section>

        <section className="flex flex-1 flex-col bg-white min-h-0">
          <div className="flex justify-between items-center shrink-0 bg-primary w-full p-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
              <img
                src={BibleBotLogo2}
                alt="Bible Chat Bot"
                className="w-30 h-auto"
              />
            </div>
          </div>

          <ConversationComponent messages={messages} isLoading={isLoading} />
          <div className="shrink-0">
            <ChatForm
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
              isLoading={isLoading}
            />
          </div>
        </section>
      </SidebarProvider>
    </div>
  );
};

export default ChatPage;
