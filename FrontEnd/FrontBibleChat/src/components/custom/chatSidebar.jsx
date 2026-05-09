import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import BibleBotLogo3 from "@/assets/BibleBotLogo3.svg";
import { useAuth } from "../../hooks/useAuth";
import { chatServices } from "../../../services/ChatServices";

export function ChatSideBar({ onNewChat }) {
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const { setOpen } = useSidebar();
  const { userData, loading, error } = useAuth();
  const [convosNames, setConvosNames] = useState([]);
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate("/chat/search");
  };
  const navChats = (id) => navigate(`/chat/${id}`);

  useEffect(() => {
    let isMounted = true;

    const fetchConversations = async () => {
      try {
        const response = await chatServices.getConversationName();
        if (isMounted) {
          const transformedConvos = response.conversation_id.map(
            (id, index) => ({
              conversation_id: id,
              conversation_names: response.conversation_names[index],
            }),
          );
          setConvosNames(transformedConvos);
        }
      } catch (error) {
        console.log("Error fetching conversation names: ", error);
      }
    };

    fetchConversations();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Sidebar collapsible="icon" className="border border-secondary">
      <SidebarHeader className="bg-primary text-white "></SidebarHeader>
      <SidebarContent className="bg-primary text-white">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={(e) => {
                  setOpen(true);
                  navigate("/chat");
                }}
              >
                <i className="bi bi-pencil-square"></i>{" "}
                <span className="group-data-[collapsible=icon]:hidden">
                  New Chat
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={() => {
                  handleSearch();
                  setOpen(true);
                }}
              >
                <i className="bi bi-search"></i>
                <span className="group-data-[collapsible=icon]:hidden">
                  Search Chat
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={() => {
                  setOpen(true);
                  setIsRecentOpen((prev) => !prev);
                }}
              >
                <i className="bi bi-clock-history"></i>
                <span className="flex justify-evenly items-center">
                  <span className="group-data-[collapsible=icon]:hidden">
                    Recent Chat
                  </span>
                  <span className="ml-auto text-xs group-data-[collapsible=icon]:hidden">
                    {isRecentOpen ? (
                      <i className="bi bi-chevron-down"></i>
                    ) : (
                      <i className="bi bi-chevron-right"></i>
                    )}
                  </span>
                </span>
              </SidebarMenuButton>
              {isRecentOpen && (
                <SidebarMenuSub>
                  {convosNames.length > 0 ? (
                    convosNames.map((chat) => (
                      <SidebarMenuSubItem key={chat.conversation_id}>
                        <SidebarMenuSubButton asChild>
                          <button
                            type="button"
                            className="flex w-full min-w-0 items-center text-left text-white hover:bg-secondary"
                            title={chat.conversation_names}
                            onClick={() => navChats(chat.conversation_id)}
                          >
                            <span className="block w-full truncate">
                              {chat.conversation_names}
                            </span>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  ) : (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <span className="text-white">No recent chats yet</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-primary text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpen(true)}>
              <i className="bi bi-person-fill"></i>
              <span className="group-data-[collapsible=icon]:hidden">
                {userData?.user.username}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
