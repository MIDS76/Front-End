"use client";

import React, { useState, useEffect } from "react";
import React, { useState } from "react";
import { useEffect } from "react";
import MedModal from "@/components/modal/medModal";
import Lista from "@/components/lista/lista";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import turmas from "@/data/turma.json";
import usuarios from "@/data/usuarios.json";
import BlocoTurmas from "@/components/modal/BlocoTurmas";
import BlocoUsuarios from "@/components/modal/BlocoUsuarios";
import { buscarTurmas } from "@/api/turmas";
import { Turma, Usuario } from "@/utils/types";
import { buscarUsuarios } from "@/api/usuarios";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "../access-denied";


export default function GerenciamentoUsersTurmas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const turmasArray = await buscarTurmas();
      setTurmas(turmasArray || []);

      const usuariosArray = await buscarUsuarios();
      setUsuarios(usuariosArray || []);
    }

    fetchData();
  }, []);

  console.log(usuarios);

  useEffect(() => {
    return () => {
      document.title = "Gerenciamento - Portal do Conselho";
    };
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
