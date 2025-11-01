"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Usuario } from "@/utils/types";
import Lista from "@/components/lista";
import { toast } from "sonner";
import TextField from "@/components/input/textField";
import ProtectedRoute from "@/components/ProtectedRoute";
import usuarios from "@/data/usuarios.json";
import turmas from "@/data/turma.json";
import { useRouter } from "next/router";

interface GerenciarTurmaProps {
  params: {
    id: number;
  };
}

export default function GereciarTurma({params}: GerenciarTurmaProps) {
  const usuariosArray = Object.values(usuarios);
  const turmasArray = Object.values(turmas);
  const router = useRouter();
  const { id } = params;

  const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const alunos = usuariosArray.filter((user) => user.role === "Aluno");

  const selectUser = (user: Usuario) => {
    setSelectedUsers((prev) =>
      prev.some((selected) => selected.id === user.id) ? prev : [...prev, user]
    );
  };

  const getTurmaById = (id: number) => Object.values(turmas).find(turma => turma.id === id);
  const turma = getTurmaById(id);

  useEffect(() => {
    document.title = "Gerenciando Turma - ConselhEXPERT";
  }, []);

  return (
    <ProtectedRoute>
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="p-6 pb-0 w-full mt-16 h-full flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
              Gerenciar Turma
            </h2>
            <div className="bg-muted rounded-lg mb-4 p-4">
              <h3 className="font-medium text-card-foreground">Resumo</h3>
              <p className="text-sm text-muted-foreground">
                 Alunos Ativos: <b>{alunos.length}</b>
              </p>
            </div>
            <div className="mb-4">
              <TextField
                label="Nome"
                type="text"
                id="className"
                value={turma?.codigoTurma}
                placeholder="Insira o nome curto da turma (ex: MI 74)"
                editavel={true}
              />
            </div>
            <div className="mb-4">
              <TextField
                value={turma?.nomeCurso}
                label="Curso"
                type="text"
                id="course"
                placeholder="Insira o curso"
              />
            </div>
            <div className="flex justify-start gap-2 mt-auto">
              <Button
                variant="outline"
                onClick={() => {
                  router.back();
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  toast.success("Turma atualizada com sucesso!");
                  setTimeout(() => {
                    router.back();
                  }, 1500);
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 px-4 mt-8">
          <div className="flex mb-4 ml-4 rounded-md overflow-hidden">
            {/*Colocar lugar para importar planilha*/}
          </div>

          <h2 className="ml-4 text-2xl font-semibold mb-4 text-card-foreground">
            Alunos da Turma
          </h2>

          <Lista
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            usuarios={alunos}
            setSelectedContact={selectUser}
            tipo={"edit"}
            selectedUsers={selectedUsers}
          />
          <div
            className="rounded-md shadow-sm overflow-y-auto pr-2"
            style={{ maxHeight: "60vh" }}
          ></div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
