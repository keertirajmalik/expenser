import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  ChartCandlestick,
  HandCoins,
  IndianRupee,
  LayoutDashboard,
  ListTree,
  Receipt,
} from "lucide-react";

import { NavMain } from "@/app/sidebar/nav-main";
import { NavSecondary } from "@/app/sidebar/nav-secondary";
import { NavUser } from "@/app/sidebar/nav-user";
import { Link } from "react-router";

const data = {
  navMain: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Category",
      url: "/category",
      icon: ListTree,
    },
    { name: "Income", url: "/income", icon: HandCoins },
    {
      name: "Expense",
      url: "/expense",
      icon: Receipt,
    },
    {
      name: "Investment",
      url: "/investment",
      icon: ChartCandlestick,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IndianRupee className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Expenser</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent role="navigation">
        <NavMain items={data.navMain} aria-label="Main navigation" />
        <NavSecondary className="mt-auto" aria-label="Secondary navigation" />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
