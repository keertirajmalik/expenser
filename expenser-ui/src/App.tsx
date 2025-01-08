import Expense from "@/app/expense/expense";
import Dashboard from "@/app/dashboard";
import { LoginPage } from "@/app/auth/login";
import { SignupPage } from "@/app/auth/signup";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router";
import { ROUTES } from "@/types/routes";
import ExpenseType from "@/app/type/type";
import { AppSidebar } from "@/app/sidebar/app-sidebar";

export function App() {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="*" element={<MainRoutes />} />
    </Routes>
  );
}

function AuthRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.AUTH.SIGNUP} element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
}

function MainRoutes() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            <Route path={ROUTES.MAIN.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.MAIN.EXPENSE} element={<Expense />} />
            <Route path={ROUTES.MAIN.TYPE} element={<ExpenseType />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
