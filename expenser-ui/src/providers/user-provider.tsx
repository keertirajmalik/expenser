import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserContextType {
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  profileImage: string;
  setProfileImage: (profileImage: string) => void;
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
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem("profileImage") || "";
  });

  useEffect(() => {
    localStorage.setItem("name", name);
    localStorage.setItem("username", username);
    localStorage.setItem("profileImage", profileImage);
  }, [name, username, profileImage]);

  return (
    <UserContext.Provider
      value={{
        name,
        setName,
        username,
        setUsername,
        profileImage,
        setProfileImage,
      }}
    >
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
