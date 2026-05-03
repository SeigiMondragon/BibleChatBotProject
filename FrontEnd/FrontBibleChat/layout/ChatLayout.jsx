import { Outlet } from "react-router-dom";
import { ChatSideBar } from "../src/components/custom/chatSidebar";
import { SidebarProvider, SidebarTrigger } from "../src/components/ui/sidebar";

export default function ChatLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
