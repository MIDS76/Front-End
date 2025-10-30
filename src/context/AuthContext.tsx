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
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Recupera sessão existente do localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const fakeUsers = [
      { email: "aluno@email.com", password: "aluno123", perfil: "Aluno" },
      { email: "pedagogico@email.com", password: "pedagogico123", perfil: "pedagogico" },
      { email: "admin@email.com", password: "admin123", perfil: "admin" },
    ];

    const found = fakeUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return false;

    // Set the cookie for middleware authentication
    document.cookie = "isLoggedIn=true; path=/";

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

  const logout = () => {
    localStorage.removeItem("user");
    // Remove the authentication cookie
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
