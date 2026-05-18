import { useState } from "react";
import BibleBotLogo2 from "@/assets/BibleBotLogo2.svg";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSideBar } from "@/components/custom/chatSidebar";
import { chatServices } from "../src/features/chat/api/chat-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchSchema } from "../src/schemas/SearchSchema";
import { useNavigate } from "react-router-dom";
import SearchForm from "../src/features/search/components/search-form";
import SearchResults from "../src/features/search/components/search-results";

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

          <SearchForm
            handleSubmit={handleSubmit}
            register={register}
            onSearch={searchConversation}
            isSearching={isSearching}
          />

          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <SearchResults
              query={query}
              searchResults={searchResults}
              onSelect={(conversationId) => navigate(`/chat/${conversationId}`)}
            />
          </div>
        </section>
      </SidebarProvider>
    </div>
  );
};

export default SearchPage;
