import { LoginPage, SignupPage } from "@/app/auth";
import Expense from "@/app/expense";
import Home from "@/app/home";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
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
