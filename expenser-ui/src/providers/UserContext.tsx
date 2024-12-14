import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [name, setName] = useState<string>(() => {
    return localStorage.getItem("name") || "";
  });
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });
  useEffect(() => {
    localStorage.setItem("name", name);
    localStorage.setItem("username", username);
  }, [name]);

  return (
    <UserContext.Provider value={{ name, setName, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
