"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        Cookies.remove("user");
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (data: {
    token: string;
    userId: number;
    name: string;
    email: string;
  }) => {
    Cookies.set("token", data.token, { expires: 1 });
    const userObj: User = { userId: data.userId, name: data.name, email: data.email };
    Cookies.set("user", JSON.stringify(userObj), { expires: 1 });
    setUser(userObj);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    persistSession(res.data);
    router.push("/dashboard");
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    persistSession(res.data);
    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
