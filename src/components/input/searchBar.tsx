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
import { cn } from "@/lib/utils"; 

interface SearchBarParams {
  texto?: string;
  className?: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  filter?: boolean;
  filtrosMostrar?: {
    aluno?: boolean;
    turma?: boolean;
    conselho?: boolean;
  };
  children?: React.ReactNode;
}

export default function SearchBar({
  texto = "",
  className = "",
  searchQuery,
  setSearchQuery,
  placeholder = "Pesquisar...",
  filter = false,
  filtrosMostrar,
  children,
}: SearchBarParams) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center rounded-xl bg-[#FAFAFA] border border-gray-300 px-3 py-2 w-full",
        className
      )}
    >
      {texto && (
        // ALTERAÇÃO AQUI: Mudei de 'text-xl' para 'text-3xl' para ficar maior
        <h1 className="text-primary font-bold font-title text-3xl mb-1">{texto}</h1>
      )}
      
      <div className="flex flex-row items-center gap-2 w-full">
        <div className="flex-1 flex flex-row items-center border-b-[1px] border-b-[#AAAAAA80]">
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-8 text-sm" 
          />
          {children}
        </div>

        {filter && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="pb-1">
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
              className="select-none min-w-[220px] p-0 bg-transparent shadow-none border-none"
            >
              <FiltrosDinamicos mostrar={filtrosMostrar} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}