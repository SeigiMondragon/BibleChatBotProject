import { Outlet, useLocation, useParams } from "react-router-dom";
import { ChatSideBar } from "../src/components/custom/chatSidebar";
import { SidebarInset, SidebarProvider } from "../src/components/ui/sidebar";
import { useAuth } from "../src/hooks/useAuth";

export default function ChatLayout() {
  const user = useAuth();
  const { convoID } = useParams();
  const location = useLocation();
  const activeConversationId =
    location.pathname === "/chat/search" ? null : convoID;

  return (
    <div className="flex w-full h-screen">
      <SidebarProvider>
        <ChatSideBar user={user} activeConversationId={activeConversationId} />

        <SidebarInset className="flex flex-1 flex-col bg-white min-h-0">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
