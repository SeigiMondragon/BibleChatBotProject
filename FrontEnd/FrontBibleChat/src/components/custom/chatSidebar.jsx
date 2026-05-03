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
} from "@/components/ui/sidebar";

export function ChatSideBar({ recentChats = [], onNewChat, selectRecentChat }) {
  const [isRecentOpen, setIsRecentOpen] = useState(true);

  return (
    <Sidebar className="border border-secondary">
      <SidebarHeader className="bg-primary text-white ">
        This is a header
      </SidebarHeader>
      <SidebarContent className="bg-primary text-white">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton type="button" onClick={onNewChat}>
                New Chat
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton type="button">Search Chat</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={() => setIsRecentOpen((prev) => !prev)}
              >
                <span>Recent Chat</span>
                <span className="ms-auto text-xs">
                  {isRecentOpen ? "v" : ">"}
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
        <i className="bi bi-person-fill">
          <span> Juan Rafael Camasis</span>
        </i>
      </SidebarFooter>
    </Sidebar>
  );
}
