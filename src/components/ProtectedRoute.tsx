"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só verifica se o contexto já terminou de carregar
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Enquanto carrega o estado inicial (pra não piscar a tela)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Carregando...
      </div>
    );
  }

  // Se não tiver usuário após o carregamento, não renderiza nada
  if (!user) {
    return null;
  }

  // Tudo certo, usuário autenticado
  return <>{children}</>;
}
