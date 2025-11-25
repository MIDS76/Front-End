"use client";

import React from "react";
import InfoCard from "@/components/card/cardSearchBar";
import SearchBar from "@/components/input/searchBar";
import Lista from "@/components/lista/lista";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Usuario } from "@/utils/types";

interface BlocoUsuariosProps {
  usuarios: Usuario[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollHeight?: string;
}

export default function BlocoUsuarios({
  usuarios,
  searchQuery,
  setSearchQuery,
  isDialogOpen,
  setIsDialogOpen,
  scrollHeight = "40rem",
}: BlocoUsuariosProps) {

  // FILTRAGEM AQUI
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <InfoCard
        titulo="Gerenciamento de Usuários"
        search={
          <div className="mt-4">
            <SearchBar
              placeholder="Procure por um usuário"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter
              filtrosMostrar={{
                aluno: true,
                turma: false,
                conselho: false,
              }}
            />
          </div>
        }
      />

      <div
        className="hsl(var(--background)) rounded-2xl shadow-lg border border-gray-200 p-2"
        style={{ height: scrollHeight }}
      >
        <ScrollArea className="h-full w-full">
          <Lista
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            tipo="edit"
            usuarios={usuariosFiltrados} 
          />
        </ScrollArea>
      </div>
    </div>
  );
}
