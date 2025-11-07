"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Lista, { Usuario } from "@/components/lista";
import { ScrollArea } from "@/components/ui/scroll-area";
import MedModal from "@/components/modal/medModal";
import ProximoConselho from "./proximoConselho";
import { useSearchParams } from "next/navigation";

interface Turma {
  id: number;
  codigoTurma: string;
  nomeCurso: string;
}

export default function NovoConselho() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]);

  const turmas: Turma[] = [
    { id: 1, codigoTurma: "MI 74", nomeCurso: "Desenvolvimento de Sistemas" },
    { id: 2, codigoTurma: "MI 75", nomeCurso: "Desenvolvimento de Sistemas" },
    { id: 3, codigoTurma: "MI 76", nomeCurso: "Eletromecânica" },
    { id: 4, codigoTurma: "MI 77", nomeCurso: "Redes de Computadores" },
    { id: 5, codigoTurma: "MI 78", nomeCurso: "Mecatrônica" },
    { id: 6, codigoTurma: "MI 79", nomeCurso: "Desenvolvimento de Sistemas" },
  ];
  const [turmasFiltradas, setTurmasFiltradas] = useState<Turma[]>(turmas);

  const alunos: Usuario[] = [
    {
      id: 1,
      nome: "Artur Neves Hopner",
      email: "artur_hopner@estudante.sesisenai.org.br",
      role: "aluno",
    },
    {
      id: 2,
      nome: "Letícia Moretti",
      email: "leticia_moretti@estudante.sesisenai.org.br",
      role: "aluno",
    },
    {
      id: 3,
      nome: "Bruna Júlia Beckziegel",
      email: "bruna_beckziegel@estudante.sesisenai.org.br",
      role: "aluno",
    },
    {
      id: 4,
      nome: "Giulia Fugel",
      email: "giulia_fugel@estudante.sesisenai.org.br",
      role: "aluno",
    },
    {
      id: 5,
      nome: "Fernanda Agnes Amorim",
      email: "fernanda_amorim@estudante.sesisenai.org.br",
      role: "aluno",
    },
    {
      id: 6,
      nome: "Gabriela Carolina Pellense",
      email: "gabriela_pellense@estudante.sesisenai.org.br",
      role: "aluno",
    },
    {
      id: 7,
      nome: "Yara Janice Schneider",
      email: "yara_schneider@estudante.sesisenai.org.br",
      role: "aluno",
    },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [proximo, setProximo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const turma = useSearchParams().get("turma");

  const handleSelectContact = (contact: Usuario) => {
    // setSelectedContact(contact);
    const isAlreadySelected = selectedUsers.some(
      (user) => user.id === contact.id
    );
    if (!isAlreadySelected) {
      setSelectedUsers([...selectedUsers, contact]);
    }
  };

  return !proximo && !turma ? (
    <div className=" overflow-hidden mx-auto p-4 md:p-12">
      {turma}
      <h1 className="text-3xl font-bold mb-8">Novo Conselho</h1>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4 ml-4">Turma selecionada</h2>

          {turmaSelecionada && (
            <div className="bg-primary/10 p-4 rounded-md mb-4 border border-primary/20">
              <h3 className="text-lg font-bold text-primary">
                {turmaSelecionada.codigoTurma}
              </h3>
              <p className="text-sm text-muted-foreground">
                {turmaSelecionada.nomeCurso}
              </p>
            </div>
          )}

          <TurmaFilter
            className="mb-4"
            filtros
            turmas={turmas}
            setFiltered={setTurmasFiltradas}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ul className="grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8 w-full"></ul>

          <ScrollArea className="h-[400px]">
            <div className="p-1 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {turmasFiltradas.map((turma) => (
                <MedModal
                  key={turma.id}
                  className={cn(
                    "items-stretch",
                    "transition-all",
                    turmaSelecionada?.id === turma.id
                      ? "ring-4 ring-secondary"
                      : "ring-4 ring-background"
                  )}
                  courseCode={turma.codigoTurma}
                  courseName={turma.nomeCurso}
                  onClick={() => setTurmaSelecionada(turma)}
                  simple
                  loading={false}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="w-full">
          <h2 className="ml-4 text-xl font-semibold mb-4">Alunos da turma</h2>

          {turmaSelecionada ? (
            <Lista
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              usuarios={alunos}
              tipo="limpa"
              setSelectedContact={handleSelectContact}
              selectedUsers={selectedUsers}
              className="h-[400px]"
            />
          ) : (
            <div className="flex items-center justify-center h-[400px] bg-card rounded-md border">
              <p className="text-muted-foreground">
                Selecione uma turma para ver os alunos
              </p>
            </div>
          )}
          <div className="flex justify-end gap-4 mt-8 px-4">
            <Button
              onClick={() => {
                open("/", "_self");
              }}
              variant="outline"
              className="w-32"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => setProximo(true)}
              className="w-32"
              disabled={!turmaSelecionada}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <ProximoConselho setProximo={setProximo} />
  );
}
