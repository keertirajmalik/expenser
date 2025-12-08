import { LoginPage } from "@/app/auth/login";
import { SignupPage } from "@/app/auth/signup";
import Category from "@/app/category/category";
import Dashboard from "@/app/dashboard";
import Expense from "@/app/expense/expense";
import Income from "@/app/income/income";
import Investment from "@/app/investment/investment";
import { AppSidebar } from "@/app/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ROUTES } from "@/types/routes";
import { Navigate, Route, Routes } from "react-router";

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
      <AppSidebar variant="floating" />
      <SidebarInset>
        <div className="flex flex-1 flex-col pt-0">
          <Routes>
            <Route path={ROUTES.MAIN.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.MAIN.CATEGORY} element={<Category />} />
            <Route path={ROUTES.MAIN.EXPENSE} element={<Expense />} />
            <Route path={ROUTES.MAIN.INVESTMENT} element={<Investment />} />
            <Route path={ROUTES.MAIN.INCOME} element={<Income />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
