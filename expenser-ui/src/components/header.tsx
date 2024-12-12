import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import ProfileButton from "@/components/ui/profile-button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { NavLink } from "react-router";
import { TransactionDialog } from "@/components/transaction-dialog";

export function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sm:flex sm:justify-between py-1 border-b">
      <Container>
        <div className="relative px-4 sm:px-4 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <NavLink to="/" end>
              <h1 className="text-xl font-bold">Expenser</h1>
            </NavLink>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* <nav className="flex items-center space-x-4 lg:space-x-6 md:block"> */}
            <TransactionDialog />
            {/* </nav> */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="mr-6"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle Theme</span>
            </Button>
            <ProfileButton />
          </div>
        </div>
      </Container>
    </header>
  );
}
