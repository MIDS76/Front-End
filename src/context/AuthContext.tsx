"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Perfil = "aluno" | "pedagogico" | "admin";

interface User {
  nome: string;
  email: string;
  perfil: Perfil;
  token: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  hasPermission: (roles: Perfil[]) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    const fakeUsers = [
      { email: "aluno@email.com", password: "aluno123", perfil: "aluno" },
      { email: "pedagogico@email.com", password: "pedagogico123", perfil: "pedagogico" },
      { email: "admin@email.com", password: "admin123", perfil: "admin" },
    ];

    const found = fakeUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return null;

    document.cookie = "isLoggedIn=true; path=/";

    const loggedUser: User = {
      nome: found.email.split("@")[0],
      email: found.email,
      perfil: found.perfil as Perfil,
      token: crypto.randomUUID(),
    };

    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = () => {
    localStorage.removeItem("user");
    document.cookie = "isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    router.push("/login");
  };

  const hasPermission = (roles: Perfil[]) => {
    return user ? roles.includes(user.perfil) : false;
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
