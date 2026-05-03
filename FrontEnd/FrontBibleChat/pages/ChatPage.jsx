import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { chatSchema } from "../src/schemas/ChatSchema";
import { chatServices } from "../services/ChatServices";
import TextType from "../plugins/textTypeAnim";
import ReactMarkdown from "react-markdown";
import BibleBotLogo2 from "@/assets/BibleBotLogo2.svg";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSideBar } from "@/components/custom/chatSidebar";

const RECENT_CHATS_KEY = "recent_chats";

const ChatPage = () => {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(chatSchema),
  });

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [conversation_id, setConversation_id] = useState(null);
  const [history, setHistory] = useState([]);
  const [convosNames, setConvosNames] = useState({});
  useEffect(() => {
    try {
      getConvosNames();
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

  const getConvosNames = async () => {
    try {
      const response = await chatServices.getConversationName();
      const transformedConvos = response.conversation_id.map((id, index) => ({
        conversation_id: id,
        conversation_names: response.conversation_names[index],
      }));
      setConvosNames(transformedConvos);
    } catch (error) {
      console.log("Error fetching conversation names: ", error);
    }
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
    <SidebarProvider className="h-screen w-full overflow-hidden">
      {/* Sidebar + content must be siblings inside SidebarProvider */}
      <ChatSideBar
        recentChats={convosNames}
        onNewChat={newChat}
        selectRecentChat={selectRecentChat}
      />
      <section className="flex flex-1 flex-col bg-white min-h-0">
        {/* Upper Part */}
        <div className="flex justify-between items-center shrink-0 bg-primary w-full p-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
            <img
              src={BibleBotLogo2}
              alt="Bible Chat Bot"
              className="w-40 h-auto"
            />
          </div>

          <p className="text-white font-bold">
            {" "}
            <i className="bi bi-person-fill"></i> Bible Chat Bot
          </p>
        </div>

        {/* Chat Part */}
        {messages.length > 0 ? (
          <div className="flex-1 min-h-0 overflow-y-auto py-5 flex flex-col">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`border border-primary px-5 mx-5 my-5 rounded-2xl   ${
                  message.role === "user"
                    ? "self-end text-primary-foreground bg-primary"
                    : "self-start text-primary bg-primary-foreground"
                }`}
              >
                <ReactMarkdown>{message.message}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="border border-black px-5 mx-5 my-5 rounded-2xl self-start ">
                <TextType
                  className="text-primary bg-primary-foreground"
                  text={[
                    "Looking for the Verses",
                    "Aligning Answers with the Bible",
                  ]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor
                  cursorCharacter="_"
                  deletingSpeed={50}
                  cursorBlinkDuration={0.5}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex w-full items-center justify-center px-4">
            <TextType
              className="text-3xl text-primary bg-primary-foreground"
              text={[
                "Hi I am BibleBot",
                "Your Personal Bible Chat Bot",
                "Happy Reading!",
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              cursorBlinkDuration={0.5}
            />
          </div>
        )}

        {/* Prompt Part */}
        <div className="shrink-0">
          <form
            className="flex justify-center items-center bg-primary w-full max-w-full py-5 px-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Textarea
              className="border-secondary-foreground bg-white placeholder:text-primary font-bold me-3 w-9/12 resize-none"
              placeholder={"Type your message here..."}
              {...register("prompt")}
            />
            {/* {errors.prompt?.message && (
              <p className="text-red-500">{errors.prompt.message}</p>
            )} */}

            <Button
              type="submit"
              className={`py-5 px-5 ${isLoading ? "bg-primary text-special" : " border border-secondary bg-secondary text-white"}`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </section>
    </SidebarProvider>
  );
};

export default ChatPage;
