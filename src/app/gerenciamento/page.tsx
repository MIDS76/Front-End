"use client";

import React, { useState, useEffect } from "react";
import MedModal from "@/components/modal/medModal";
import Lista from "@/components/lista/lista";
import { ScrollArea } from "@/components/ui/scroll-area";
import turmas from "@/data/turma.json";
import usuarios from "@/data/usuarios.json";
import ProtectedRoute from "@/components/ProtectedRoute";
import SearchBar from "@/components/input/searchBar";
import { useRouter } from "next/navigation";
import InfoCard from "@/components/card/cardSearchBar";

export default function GerenciamentoUsersTurmas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const turmasArray = turmas;
  const usuariosArray = usuarios;

  const router = useRouter();

  useEffect(() => {
    document.title = "Gerenciamento - Portal do Consel";
  }, []);

  const handleTurmaClick = (id: number) => {
    router.push(`/gerenciamento/turma/${id}`);
  };

  return (
    <ProtectedRoute>
      <div
        className="
          mt-32 w-full grid gap-10
          grid-cols-1
          tablet:grid-cols-1
          laptop:grid-cols-2
          desktop:grid-cols-2
          px-10
          laptop:max-w-[1350px] laptop:mx-auto
        "
      >
        {/* BLOCO TURMAS */}
        <div className="w-full flex flex-col gap-6">
          {/* InfoCard */}
          <InfoCard
            titulo="Gerenciamento de Turmas"
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

          {/* CARD BRANCO + SCROLL */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <ScrollArea className="h-[500px] tablet:h-[600px] laptop:h-[700px] desktop:h-[800px] w-full">
              <div
                className="
                  grid 
                  grid-cols-1 
                  tablet:grid-cols-2 
                  gap-4 
                  px-4
                  auto-rows-fr
                "
              >
                {turmasArray?.map((classItem, index) => (
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

        {/* BLOCO USUÁRIOS */}
        <div className="w-full flex flex-col gap-6">
          {/* InfoCard */}
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

          {/* CARD BRANCO + SCROLL */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <ScrollArea className="h-[500px] tablet:h-[500px] laptop:h-[418px] desktop:h-[480px] w-full">
              <Lista
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                tipo="edit"
                usuarios={usuariosArray}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
