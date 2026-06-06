import { useState } from "react";
import BibleBotLogo2 from "@/assets/BibleBotLogo2.svg";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSideBar } from "@/components/custom/chatSidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchSchema } from "../src/schemas/SearchSchema";
import { useNavigate } from "react-router-dom";
import SearchForm from "../src/features/search/components/search-form";
import SearchResults from "../src/features/search/components/search-results";
import { useSearchConversationsQuery } from "../src/features/chat/hooks/use-chat";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { data: searchData, isFetching: isSearching } =
    useSearchConversationsQuery(query);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(SearchSchema),
  });

  const searchConversation = async (data) => {
    const text = data?.search?.trim?.() ?? data?.query?.trim?.() ?? "";
    setQuery(text);
  };

  const searchResults = query ? (searchData?.conversations ?? []) : [];

  return (
    <div className="flex w-full h-screen">
      <SidebarProvider>
        <section>
          <ChatSideBar activeConversationId={null} />
        </section>

        <section className="flex flex-1 flex-col bg-white min-h-0">
          <div className="flex justify-between items-center shrink-0 bg-primary w-full p-3">
            <div className="flex items-center gap-3">
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
