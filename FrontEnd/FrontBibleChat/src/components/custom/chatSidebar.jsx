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
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../features/auth/hooks/use-auth";
import { useConversationNamesQuery } from "../../features/chat/hooks/use-chat";
import { toast } from "sonner";
export function ChatSideBar({ activeConversationId, user }) {
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const { setOpen } = useSidebar();

  const navigate = useNavigate();
  const logout = useLogoutMutation();
  const { data: conversationNamesData, isPending: isConvosLoading } =
    useConversationNamesQuery();

  const handleSearch = () => {
    navigate("/chat/search");
  };
  const navChats = (id) => navigate(`/chat/${id}`);
  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out");
        navigate("/");
      },
      onError: (error) => {
        const message = error?.response?.data?.message || "Logout failed";
        toast.error(message);
      },
    });
  };

  const usernameLabel = user?.loading
    ? "Loading..."
    : (user?.userData?.username ?? "Account");

  const convosNames =
    conversationNamesData?.conversation_id?.map((id, index) => ({
      conversation_id: id,
      conversation_names: conversationNamesData.conversation_names[index],
    })) ?? [];

  return (
    <Sidebar collapsible="icon" className="border border-secondary">
      <SidebarHeader className="bg-primary text-white">
        <div className="flex items-center justify-between">
          <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-primary text-white">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={() => {
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
                  {isConvosLoading ? (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <span className="text-white">Loading...</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ) : convosNames.length > 0 ? (
                    convosNames.map((chat) => {
                      const isActive =
                        String(chat.conversation_id) ===
                        String(activeConversationId ?? "");

                      return (
                        <SidebarMenuSubItem key={chat.conversation_id}>
                          <SidebarMenuSubButton asChild>
                            <button
                              type="button"
                              className={`flex w-full min-w-0 items-center text-left text-white ${
                                isActive
                                  ? "bg-secondary/70"
                                  : "hover:bg-secondary"
                              }`}
                              title={chat.conversation_names}
                              onClick={() => navChats(chat.conversation_id)}
                              aria-current={isActive ? "page" : undefined}
                            >
                              <span className="block w-full truncate">
                                {chat.conversation_names}
                              </span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton onClick={() => setOpen(true)}>
                  <i className="bi bi-person-fill"></i>
                  <span className="group-data-[collapsible=icon]:hidden">
                    {usernameLabel}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" sideOffset={8}>
                <DropdownMenuItem onSelect={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
