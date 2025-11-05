"use client";

import ButtonTT from "../button/ButtonTT";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import FiltrosDinamicos from "../filtros/FiltrosDinamicos";
import React from "react";

interface SearchBarParams {
  className?: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  filter?: boolean;
  type?: "aluno" | "turma" | "conselho";
  children?: React.ReactNode;
}

export default function SearchBar({
  className = "",
  searchQuery,
  setSearchQuery,
  placeholder = "Pesquisar...",
  filter = false,
  type = "turma",
  children,
}: SearchBarParams) {
  const mostrarFiltros = {
    aluno: type === "aluno",
    turma: type === "turma",
    conselho: type === "conselho",
  };

  return (
    <div
      className={`flex flex-row items-center gap-2 justify-between w-full ${className}`}
    >
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />

      {children}

      {filter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <ButtonTT
                tooltip="Visualizar e aplicar filtros"
                mode="small"
                icon="MdFilterAlt"
                className="shrink-0"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className={`select-none min-w-[220px] ${
              type ? "p-0 bg-transparent shadow-none border-none" : "p-2 pt-0"
            }`}
          >
            <FiltrosDinamicos mostrar={mostrarFiltros} />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
