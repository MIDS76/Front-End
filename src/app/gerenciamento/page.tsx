"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { Usuario, Turma } from "@/utils/types";
import MedModal from "@/components/modal/medModal";
import TurmaFilter from "@/components/input/turmasFilter";
import Lista from "@/components/lista";
import { ScrollArea } from "@/components/ui/scroll-area";
import turmas from "@/data/turma.json";
import usuarios from "@/data/usuarios.json";

export default function GerenciamentoUsersTurmas() {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");

  const [turmasFiltradas, setTurmasFiltradas] = React.useState<Turma[]>(
    Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      codigoTurma: `Turma ${index + 1}`,
      nomeCurso: `Turma ${index + 1}`,
      dataInicio: new Date().toISOString(),
      dataFim: new Date().toISOString(),
      status: "Ativa",
    }))
  );

  const turmasArray = Object.values(turmas);
  const usuariosArray = Object.values(usuarios);

  useEffect(() => {
    if (turmas) {
      setTurmasFiltradas(turmasArray);
    }

  }, [turmas]);

  useEffect(() => {
    return () => {
      document.title = "Gerenciamento - ConselhEXPERT";
    };
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-5rem)]">
        <section className="flex flex-col h-full gap-4 w-full py-8 px-4 lg:w-1/2">
          <div className="flex flex-col gap-6">
            <h2 className="px-4 text-2xl font-title font-bold text-accent-foreground">
              Gerenciar uma turma
            </h2>

            <TurmaFilter
              className="px-4"
              loading= {true}
              turmas={turmasArray}
              setFiltered={setTurmasFiltradas}
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
            />
            </div>

          <ScrollArea className="w-full h-[600px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 px-4">
              {turmasFiltradas?.map((classItem, index) => (
                <MedModal
                  loading={true}
                  key={index}
                  courseCode={classItem.codigoTurma}
                  courseName={classItem.nomeCurso}
                  onClick={() => open("/gerenciamento/turma", "_self")}
                  simple
                />
              ))}
            </div>
          </ScrollArea>
        </section>

        <section className="flex flex-col justify-between gap-4 w-full py-2 lg:py-8 px-4 lg:w-1/2 h-full">
          <h2 className="px-4 text-2xl font-title font-bold text-accent-foreground">
            Gerenciar Usuários
          </h2>
          <Lista
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            setSearchQuery={setSearchQueryUsuarios}
            searchQuery={searchQueryUsuarios}
            loading={true}
            className="h-[600px] "
            tipo="edit"
            setSelectedContact={() => {}}
            usuarios={usuariosArray ?? []}
          />
        </section>
      </div>
    </>
  );
}
