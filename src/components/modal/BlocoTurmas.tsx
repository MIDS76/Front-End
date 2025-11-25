"use client";

import React from "react";
import InfoCard from "@/components/card/cardSearchBar";
import SearchBar from "@/components/input/searchBar";
import MedModal from "@/components/modal/medModal";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Turma {
  id: number;
  codigoTurma: string;
  nomeCurso: string;
}

interface BlocoTurmasProps {
    turmas: Turma[];
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>; 
    handleTurmaClick: (id: number) => void;
  }
  

export default function BlocoTurmas({
  turmas,
  searchQuery,
  setSearchQuery,
  handleTurmaClick,
}: BlocoTurmasProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <InfoCard
        titulo="Gerenciamento de turmas"
        search={
          <div className="mt-4">
            <SearchBar
              placeholder="Procure por uma turma"
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

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 h-[600px]">
        <ScrollArea className="h-full w-full">
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-2 gap-4 px-4 auto-rows-min items-start">
            {turmas?.map((classItem, index) => (
              <div className="h-32" key={index}>
                <MedModal
                  courseCode={classItem.codigoTurma}
                  courseName={classItem.nomeCurso}
                  onClick={() => handleTurmaClick(classItem.id)}
                  simple
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
