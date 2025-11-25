"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import turmas from "@/data/turma.json";
import usuarios from "@/data/usuarios.json";
import BlocoTurmas from "@/components/modal/BlocoTurmas";
import BlocoUsuarios from "@/components/modal/BlocoUsuarios";

export default function GerenciamentoUsersTurmas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQueryTurmas, setSearchQueryTurmas] = useState("");
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "Gerenciamento - Portal do Consel";
  }, []);

  const handleTurmaClick = (id: number) => {
    router.push(`/gerenciamento/turma/${id}`);
  };

  return (
    <ProtectedRoute>
      <div className="mt-32 w-full grid gap-10 grid-cols-1 tablet:grid-cols-1 laptop:grid-cols-2 desktop:grid-cols-2 px-10 laptop:max-w-[1350px] laptop:mx-auto">
    
        <BlocoTurmas
          turmas={turmas}
          searchQuery={searchQueryTurmas}
          setSearchQuery={setSearchQueryTurmas} 
          handleTurmaClick={handleTurmaClick}
        />

        <BlocoUsuarios
          usuarios={usuarios}
          searchQuery={searchQueryUsuarios}
          setSearchQuery={setSearchQueryUsuarios} 
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />

      </div>
    </ProtectedRoute>
  );
}
