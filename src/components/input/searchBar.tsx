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
  texto?: string;
  className?: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  filter?: boolean;
  filtrosMostrar?: {
    usuario?: boolean;
    turma?: boolean;
    conselho?: boolean;
  };
  children?: React.ReactNode;
  onSelect?: (grupo: string, valor: string) => Promise<void>;
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
  onSelect
}: SearchBarParams) {
  return (
    <div className=" flex flex-col items-start gap-1 justify-center rounded-xl bg-[#FAFAFA] p-4 ml-7 tablet:w-[46%] laptop:w-[35%] desktop:w-[25%] ">
      <h1 className="text-primary font-bold font-title text-3xl">{texto}</h1>
      <div
        className={`flex flex-row items-center gap-2 justify-between w-full border-t-[1px] border-t-[#AAAAAA80] pt-1  ${className}`}
      >
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className=""
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
              className="select-none min-w-[220px] p-0 bg-transparent shadow-none border-none"
            >
              <FiltrosDinamicos
                mostrar={filtrosMostrar}
                onSelect={onSelect} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
