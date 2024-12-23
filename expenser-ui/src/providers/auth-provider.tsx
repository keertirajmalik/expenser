import { useUser } from "@/providers/user-provider";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";

interface AuthContextType {
  isLoggedIn: boolean;
  handleLogin: (token: string, name: string, username: string) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function clearLocalStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("expireAt");
  localStorage.removeItem("name");
  localStorage.removeItem("username");
}

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setName, setUsername } = useUser();

  useEffect(() => {
    if (location.pathname.startsWith("/auth")) {
      clearLocalStorage();
      setIsLoggedIn(true);
      return;
    }
    const token = localStorage.getItem("token");
    const expireAt = localStorage.getItem("expireAt");

    if (token && expireAt && new Date(expireAt) > new Date()) {
      setIsLoggedIn(true);
      return;
    }
    handleLogout();
  }, [navigate]);

  const handleLogin = (token: string, name: string, username: string) => {
    const expireAt = new Date(Date.now() + 1000 * 60 * 30).toString();
    localStorage.setItem("token", token);
    localStorage.setItem("expireAt", expireAt);
    localStorage.setItem("name", name);
    localStorage.setItem("username", username);
    setName(name);
    setUsername(username);
    setIsLoggedIn(true);
    navigate("/");
  };

  const handleLogout = () => {
    clearLocalStorage();
    setIsLoggedIn(false);
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
