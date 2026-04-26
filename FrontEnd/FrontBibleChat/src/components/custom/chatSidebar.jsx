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
} from "@/components/ui/sidebar";

export function ChatSideBar({ recentChats = [] }) {
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
              <SidebarMenuButton type="button">New Chat</SidebarMenuButton>
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
                    recentChats.map((chat, index) => (
                      <SidebarMenuSubItem key={`${chat}-${index}`}>
                        <SidebarMenuSubButton asChild>
                          <button
                            type="button"
                            className="w-full text-left"
                            title={chat}
                          >
                            {chat}
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
