"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Perfil = "Aluno" | "pedagogico" | "admin";

interface User {
  nome: string;
  email: string;
  perfil: Perfil;
  token: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (roles: Perfil[]) => boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Recuperar sessão existente
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Login simulado (substituir depois pela api)
  const login = async (email: string, password: string) => {
    const fakeUsers = [
      { email: "aluno@email.com", password: "aluno123", perfil: "aluno" },
      { email: "pedagogico@email.com", password: "pedagogico123", perfil: "pedagogico" },
      { email: "admin@email.com", password: "admin123", perfil: "admin" },
    ];

    const found = fakeUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return false;

    const loggedUser: User = {
      nome: found.email.split("@")[0],
      email: found.email,
      perfil: found.perfil as Perfil,
      token: crypto.randomUUID(),
    };

    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    return true;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  // Verifica permissão
  const hasPermission = (roles: Perfil[]) => {
    if (!user) return false;
    return roles.includes(user.perfil);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
