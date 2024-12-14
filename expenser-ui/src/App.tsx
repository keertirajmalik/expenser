import Expense from "@/app/expense";
import Home from "@/app/home";
import { LoginPage } from "@/app/login";
import { SignupPage } from "@/app/signup";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/AuthContext";
import { Routes, Route, Navigate } from "react-router";

export function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="*" element={<MainRoutes isLoggedIn={isLoggedIn} />} />
    </Routes>
  );
}

function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
}

function MainRoutes({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Home /> : <LoginPage />} />
            <Route
              path="/expense"
              element={isLoggedIn ? <Expense /> : <LoginPage />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
