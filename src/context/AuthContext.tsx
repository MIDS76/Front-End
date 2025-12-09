"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiLogin } from "@/api/login";
import { toast } from "sonner";

type Role = "aluno" | "pedagogico" | "admin" | "weg" | "supervisor";

interface User {
  id: number;
  email: string;
  role: Role;
  token: string;
  primeiroAcesso: boolean;
}


interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  hasPermission: (roles: Role[]) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const cookie = Cookies.get("session");
      const session = cookie ? JSON.parse(cookie) : null;
  
      if (session) {
        setUser({
          id: session.id,
          email: session.email,
          role: session.role.toLowerCase(),
          token: session.token,
          primeiroAcesso: session.primeiroAcesso,
        });
      }
  
      setLoading(false);
    };
  
    verify();
  }, []);
  

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const session = await apiLogin(email, password);

      if (session && session.token) {
        Cookies.set('session', JSON.stringify(session), {
          expires: 7,
          path: '/',
        });

        setUser({
          id: session.id,
          email: session.email,
          role: session.role.toLowerCase(),
          token: session.token,
          primeiroAcesso: session.primeiroAcesso,
        });

        return session;
      } else {
        toast.message("Erro ao fazer login. Tente novamente.");
        return null;
      }
    } catch (error) {
      toast.message("Erro ao fazer login. Tente novamente.");
      return null;
    }
  };

  const logout = () => {
    Cookies.remove('session');
    setUser(null);
    router.push("/login");
  };

  const hasPermission = (roles: Role[]) => {
    return user ? roles.includes(user.role) : false;
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
