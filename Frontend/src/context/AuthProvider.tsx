import { ReactNode, createContext, useEffect, useState } from "react";
import { getIsAuth, signInUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks";
import { NotificationType } from "./NotificationProvider";

interface AuthInfoType {
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar: any;
  } | null;
  isPending: boolean;
  isLoggedIn: boolean;
  error: string;
}

export interface AuthContextType {
  authInfo: AuthInfoType;
  handleLogin: (email: string, password: string) => Promise<void>;
  isAuth: () => Promise<void>;
  handleLogout: () => void;
}

const defaultAuthInfo: AuthInfoType = {
  profile: null,
  isPending: false,
  isLoggedIn: false,
  error: "",
};

// Create context with default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { updateNotification } = useNotification() as NotificationType;
  const [authInfo, setAuthInfo] = useState({
    ...defaultAuthInfo,
  });
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setAuthInfo({ ...authInfo, isPending: true });

    const { error, user } = await signInUser({ email, password });

    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }
    navigate("/", { replace: true });
    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });
    localStorage.setItem("auth-token", user.token);
  };

  const isAuth = async () => {
    setAuthInfo({ ...authInfo, isPending: true });
    const token = localStorage.getItem("auth-token");
    if (!token) return setAuthInfo({ ...authInfo, isPending: false });

    const { error, user } = await getIsAuth(token);

    if (error) return setAuthInfo({ ...authInfo, isPending: false, error });

    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
    navigate("/", { replace: true });
  };

  useEffect(() => {
    isAuth();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{ authInfo, handleLogin, isAuth, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
