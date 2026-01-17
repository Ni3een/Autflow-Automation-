"use client";
import Image from "next/image";
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

// Fixed and expanded menu items (flat array - no need for groups unless you want sections)
const menuItems = [
  {
    title: "Workflows",
    icon: FolderOpenIcon,
    url: "/workflows",
  },
  // Add more items as needed
  {
    title:"Credentials",
    icon:KeyIcon,
    url:"/credentials",
  },
  {
    title:"Executions",
    icon:HistoryIcon,
    url:"/executions",
  }
];

export const AppSidebar = () => {
    const router=useRouter();
    const pathname=usePathname();

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader>
            <SidebarMenuItem>
                <SidebarMenuButton asChild className="gap-x-4 h-10 px-4 hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Link href="/workflows" prefetch>
                    <Image src="/logo/autoflow.svg" alt="Autoflow" width={32} height={32} />
                    <span className="font-semibold text-sm">Autoflow</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={
                        item.url==="/"?pathname==="/":pathname.startsWith(item.url)
                      }
                      className="gap-x-4 h-10 px-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-[1.02]"
                    >
                     <Link href={item.url} prefetch>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                     </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="gap-x-4 h-10 px-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-[1.02]"
                onClick={()=>{}}
                >
                <StarIcon className="h-4 w-4"/>
                <span>Upgrade to Pro</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                tooltip="Billing Portal"
                className="gap-x-4 h-10 px-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-[1.02]"
                onClick={()=>{}}
                >
                <CreditCardIcon className="h-4 w-4"/>
                <span>Billing Portal</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                tooltip="Sign Out"
                className="gap-x-4 h-10 px-4 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-[1.02]"
                onClick={()=>authClient.signOut({
                    fetchOptions:{
                        onSuccess:()=>{
                            router.push("/login");
                        }
                    }
                })}
                >
                <LogOutIcon className="h-4 w-4"/>
                <span>Sign Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        </SidebarFooter>

    </Sidebar>
  );
}; 