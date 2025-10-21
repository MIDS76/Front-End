"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import Lista, { Usuario } from "@/components/lista";
import MedModal from "@/components/modal/medModal";
import TurmaFilter from "@/components/input/turmasFilter";
import { Turma } from "@/components/modal/conselhosModal";
import useSWR from "swr";
import { Page } from "@/utils/types";

import Paginacao from "@/components/paginacao";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GerenciamentoUsersTurmas() {
  const [paginaAtualTurmas, setPaginaAtualTurmas] = useState(0);
  const [paginaAtualUsuarios, setPaginaAtualUsuarios] = useState(0);
  const [totalPagesTurmas, setTotalPagesTurmas] = useState(0);
  const [totalPagesUsuarios, setTotalPagesUsuarios] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const {
    data: turmas,
    isLoading,
    error,
  } = useSWR<Page<Turma>>(
    `http://localhost:8099/api/turmas/listar?page=${paginaAtualTurmas}&size=12&nomeCurso=${searchQuery}&codigoTurma=${searchQuery}`,
    fetcher
  );

  const {
    data: usuarios,
    isLoading: isLoadingUsuarios,
    error: errorUsuarios,
  } = useSWR<Page<Usuario>>(
    `http://localhost:8099/api/usuarios/listar?page=${paginaAtualUsuarios}&nome=${searchQueryUsuarios}&email=${searchQueryUsuarios}`,
    fetcher
  );
  useEffect(() => {
    setPaginaAtualTurmas(0);
  }, [searchQuery]);

  useEffect(() => {
    setPaginaAtualUsuarios(0);
  }, [searchQueryUsuarios]);

  useEffect(() => {
    if (usuarios) {
      setTotalPagesUsuarios(usuarios.totalPages);
    }
  }, [usuarios]);

  useEffect(() => {
    if (turmas) {
      setTurmasFiltradas(turmas.content);
      setTotalPagesTurmas(turmas.totalPages);
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
              loading={isLoading || error}
              turmas={
                isLoading || error ? turmasFiltradas : turmas?.content ?? []
              }
              setFiltered={setTurmasFiltradas}
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
            />
          </div>

          <ScrollArea className="w-full h-[600px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 px-4">
              {turmasFiltradas?.map((classItem, index) => (
                <MedModal
                  loading={isLoading || error}
                  key={index}
                  courseCode={classItem.codigoTurma}
                  courseName={classItem.nomeCurso}
                  onClick={() => open("/gerenciamento/turma", "_self")}
                  simple
                />
              ))}
            </div>
          </ScrollArea>
          <div className="mt-auto">
            <Paginacao
              paginaAtual={paginaAtualTurmas}
              setPaginaAtual={setPaginaAtualTurmas}
              totalPages={totalPagesTurmas}
            />
          </div>
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
            loading={isLoadingUsuarios || errorUsuarios}
            className="h-[600px] "
            tipo="edit"
            setSelectedContact={() => {}}
            usuarios={usuarios?.content ?? []}
          />

          <Paginacao
            paginaAtual={paginaAtualUsuarios}
            setPaginaAtual={setPaginaAtualUsuarios}
            totalPages={totalPagesUsuarios}
          />
        </section>
      </div>
    </>
  );
}
