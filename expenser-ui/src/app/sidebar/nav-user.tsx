import AccountPage from "@/app/sidebar/account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { generateAvatarName } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { useState } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { handleLogout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User> => {
      const res = await apiRequest("/cxf/user", "GET");
      return res.json();
    },
  });

  if (isLoading) return <Skeleton />;

  if (error) showToast("An error has occurred", error.message);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data?.image} alt={data?.name} />
                  <AvatarFallback className="rounded-lg">
                    {generateAvatarName(data?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data?.name}</span>
                  <span className="truncate text-xs">{data?.username}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data?.image} alt={data?.name} />
                    <AvatarFallback className="rounded-lg">
                      {generateAvatarName(data?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data?.name}</span>
                    <span className="truncate text-xs">{data?.username}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setAccountOpen(true)}>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <AccountPage
        open={accountOpen}
        setOpen={setAccountOpen}
        name={data?.name ?? ""}
        username={data?.username ?? ""}
        profileImage={data?.image ?? ""}
      />
    </>
  );
}
