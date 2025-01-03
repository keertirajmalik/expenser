import * as React from "react";
import { Moon, Sun } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/providers/theme-provider";

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key="Toggle theme">
            <SidebarMenuButton asChild>
              <div
                className="flex items-center space-x-1"
                role="group"
                aria-label="Theme toggle"
              >
                {theme === "light" ? <Sun /> : <Moon />}
                <Label htmlFor="toggle-theme">
                  {theme === "light" ? "Light Mode" : "Dark Mode"}
                </Label>
                <Switch
                  id="toggle-theme"
                  aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
                  checked={theme === "light"}
                  onCheckedChange={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
