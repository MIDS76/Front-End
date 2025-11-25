"use client";

import React from "react";
import InfoCard from "@/components/card/cardSearchBar";
import SearchBar from "@/components/input/searchBar";
import Lista from "@/components/lista/lista";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Usuario } from "@/utils/types";


// interface Usuario {
//   id: number;
//   nome: string;
//   email: string;
 
// }

interface BlocoUsuariosProps {
  usuarios: Usuario[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function BlocoUsuarios({
  usuarios,
  searchQuery,
  setSearchQuery,
  isDialogOpen,
  setIsDialogOpen,
}: BlocoUsuariosProps) {
  return (
    <div className="w-full flex flex-col gap-6">
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
                aluno: false,
                turma: true,
                conselho: false,
              }}
            />
          </div>
        }
      />

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-[600px]">
        <ScrollArea className="h-full w-full">
          <Lista
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            tipo="edit"
            usuarios={usuarios}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
