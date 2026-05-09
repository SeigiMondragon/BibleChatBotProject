import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import BibleBotLogo2 from "@/assets/BibleBotLogo2.svg";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSideBar } from "@/components/custom/chatSidebar";
import { chatServices } from "../services/ChatServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchSchema } from "../src/schemas/SearchSchema";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  // const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(SearchSchema),
  });

  const searchConversation = async (data) => {
    try {
      const text = data?.search?.trim?.() ?? data?.query?.trim?.() ?? "";
      setQuery(text);
      setIsSearching(true);

      const response = await chatServices.searchConversationByName(text);

      setSearchResults(response?.conversations ?? []);
    } catch (error) {
      console.log("Error searching conversations: ", error);
    } finally {
      setIsSearching(false);
    }
  };
  const selectConversation = async (conversation_id) => {
    try {
      setSelectedConversationId(conversation_id);
      const response =
        await chatServices.getConversationMessages(conversation_id);
      setSelectedMessages(response ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const newChat = () => {
    setQuery("");
    setSearchResults([]);
    setSelectedConversationId(null);
  };

  return (
    <div className="flex w-full h-screen">
      <SidebarProvider>
        <section>
          <ChatSideBar
            recentChats={recentChats}
            onNewChat={newChat}
            selectRecentChat={selectConversation}
          />
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

          <form
            className="shrink-0 bg-primary/5 border-b border-primary/10 p-6"
            onSubmit={handleSubmit(searchConversation)}
          >
            <div className="flex gap-3 max-w-3xl">
              <Input
                {...register("search")}
                placeholder="Search conversation title..."
                className="bg-white border-secondary-foreground text-primary"
              />
              <Button
                type="submit"
                disabled={isSearching}
                className="border border-secondary bg-secondary text-white"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>

          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            {searchResults.length === 0 ? (
              <div className="text-primary/70">
                {query.trim()
                  ? "No matching conversations found."
                  : "Type a conversation name and click Search."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => navigate(`/chat/${conversation.id}`)}
                    className={`rounded-2xl border px-4 py-3 text-left transition-colors`}
                  >
                    <div className="font-semibold truncate">
                      {conversation.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </SidebarProvider>
    </div>
  );
};

export default SearchPage;
