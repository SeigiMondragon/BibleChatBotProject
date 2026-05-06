import { useState } from "react";
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
import BibleBotLogo3 from "@/assets/BibleBotLogo3.svg";
import { useAuth } from "../../hooks/useAuth";
export function ChatSideBar({ recentChats = [], onNewChat, selectRecentChat }) {
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const { setOpen } = useSidebar();
  const { userData, loading, error } = useAuth();

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
                  if (onNewChat) onNewChat(e);
                }}
              >
                <i className="bi bi-pencil-square"></i>{" "}
                <span className="group-data-[collapsible=icon]:hidden">
                  New Chat
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton type="button" onClick={() => setOpen(true)}>
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
                  {recentChats.length > 0 ? (
                    recentChats.map((chat) => (
                      <SidebarMenuSubItem key={chat.conversation_id}>
                        <SidebarMenuSubButton asChild>
                          <button
                            type="button"
                            className="flex w-full min-w-0 items-center text-left text-white hover:bg-secondary"
                            title={chat.conversation_names}
                            onClick={() =>
                              selectRecentChat(chat.conversation_id)
                            }
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
