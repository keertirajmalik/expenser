import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState<string>(() => {
    const matchingItem = items.find((item) => item.url === location.pathname);
    return matchingItem?.name ?? "Dashboard";
  });

  useEffect(() => {
    const matchingItem = items.find((item) => item.url === location.pathname);
    if (matchingItem) {
      setSelectedItem(matchingItem.name);
    }
  }, [location.pathname, items]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={selectedItem === item.name}
              onClick={() => setSelectedItem(item.name)}
              role="menuitem"
              aria-current={selectedItem === item.name ? "page" : undefined}
              className={`
                          data-[active=true]:font-semibold
                          border-l-[3px] border-transparent
                          data-[active=true]:border-[hsl(var(--primary))]
                          dark:data-[active=true]:border-[hsl(var(--primary))]
                        `}
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
