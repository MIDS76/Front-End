// FiltrosPesquisa.tsx
"use client";
import React from "react";
import { MdSortByAlpha } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import {
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface FiltrosPesquisaProps {
  onSortChange: (valor: "recente" | "antigo") => void;
  onYearChange: (ano: string) => void;
}

export default function FiltrosPesquisa({ onSortChange, onYearChange }: FiltrosPesquisaProps) {
  return (
    <>
      <DropdownMenuLabel className="text-lg font-bold text-accent-foreground p-4 pl-2 pb-1">
        Filtros
      </DropdownMenuLabel>

      <div className="flex flex-col gap-2 px-2 pb-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-row items-center font-medium text-sm text-accent-foreground ml-[-8px]">
            <MdSortByAlpha className="mr-2" size={16} /> Ordenar por
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer text-sm mx-4"
            onClick={() => onSortChange("recente")}
          >
            Mais recente
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-sm mx-4"
            onClick={() => onSortChange("antigo")}
          >
            Mais antigo
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Filtrar por ano */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-row items-center font-medium text-sm text-accent-foreground ml-[-8px]">
            <IoDocumentText className="mr-2" size={16} /> Filtrar por Ano
          </DropdownMenuLabel>
          {["Todos", "2024", "2025"].map((ano) => (
            <DropdownMenuItem
              key={ano}
              className="cursor-pointer text-sm mx-4"
              onClick={() => onYearChange(ano === "Todos" ? "" : ano)}
            >
              {ano}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </div>
    </>
  );
}
