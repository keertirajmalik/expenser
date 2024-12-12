import Home from "@/app/home";
import { LoginPage } from "@/app/login";
import { SignupPage } from "@/app/signup";
import { useAuth } from "@/providers/AuthContext";
import { Routes, Route } from "react-router";

export function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Home /> : <LoginPage />} />
      <Route path="auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}
