import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../lib/api-client/userApi";

type UserType = {
  name: string;
  email: string;
  isEmailVerified: string;
  createdAt: Date;
  updatedAt: Date;
  userPreferences: { enable2FA: boolean };
};

type AuthContextType = {
  user?: UserType;
  isLoggedIn: boolean;
  isLoading: boolean;
};
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await fetchCurrentUser();
        console.log(data);
        setUser(data.user);
        setIsLoggedIn(true);
        navigate("/");
      } catch (error: unknown) {
        throw new Error("something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isLoading, user, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("context must be contextProvider");
  }
  return context;
};
