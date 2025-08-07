import {
  createContext,
  JSX,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";

interface AuthContextType {
  isLoggedIn: boolean;
  handleLogin: (token: string) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function clearLocalStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("expireAt");
  localStorage.removeItem("name");
  localStorage.removeItem("username");
  localStorage.removeItem("profileImage");
}

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/auth")) {
      clearLocalStorage();
      setIsLoggedIn(false);
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

  const handleLogin = (token: string) => {
    const expireAt = new Date(Date.now() + 1000 * 60 * 30).toString();
    localStorage.setItem("token", token);
    localStorage.setItem("expireAt", expireAt);
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    clearLocalStorage();
    setIsLoggedIn(false);
    navigate("/auth/login");
  };

  return (
    (<AuthContext value={{ isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext>)
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
