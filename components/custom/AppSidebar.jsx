// components/custom/AppSidebar.jsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import { MessageCircleCode, X } from "lucide-react";
import WorkSpaceHistory from "./WorkSpaceHistory";
import { SideBarFooter } from "./SidebarFooter";
import { UserDetailContext } from "@/context/userDetailContext";
import { useContext } from "react";
import { useRouter } from 'next/navigation'

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const { userDetails } = useContext(UserDetailContext);
  const Router = useRouter();
  const onLogoClick = () => {
    toggleSidebar();
    
  Router.push('/');
  }
  

  return (
    <div>
      {userDetails?.name && (
        <Sidebar>
          <SidebarHeader className="p-5 relative">
            <Image src={"/log.jpg"} alt="logo" width={40} height={40} />
            <X
              className="absolute top-4 right-4 w-6 h-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={toggleSidebar}
            />
          </SidebarHeader>

          <SidebarContent className="p-5">
            <Button className="mt-5 w-full" onClick={onLogoClick} >
              <MessageCircleCode className="mr-2" /> Start new Chat
            </Button>

            <SidebarGroup>
              <WorkSpaceHistory />
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SideBarFooter />
          </SidebarFooter>
        </Sidebar>
      )}
    </div>
  );
}
