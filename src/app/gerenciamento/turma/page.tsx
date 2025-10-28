"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Lista, { Usuario } from "@/components/lista";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TextField from "@/components/input/textField";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function GereciarTurma() {
  const allUsers: Usuario[] = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    nome: `Usuário ${index + 1}`,
    email: `usuario${index + 1}@email.com`,
    role: "aluno",
  }));

  const [userFilter, setUserFilter] = useState("Alunos");
  const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = allUsers.filter((user) =>
    userFilter === "Alunos" ? user.id % 2 === 0 : user.id % 2 !== 0
  );

  const selectUser = (user: Usuario) => {
    setSelectedUsers((prev) =>
      prev.some((selected) => selected.id === user.id) ? prev : [...prev, user]
    );
  };

  const router = useRouter();

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
                Professores: <b>5</b>, Alunos: <b>15</b>
              </p>
            </div>
            <div className="mb-4">
              <TextField
                label="Nome"
                type="text"
                id="className"
                value="MI 74"
                placeholder="Insira o nome curto da turma (ex: MI 74)"
                editavel={true}
              />
            </div>
            <div className="mb-4">
              <TextField
                value="Desenvolvimento de Sistemas de Informação"
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
            <button
              className={`py-2 px-4 text-center ${
                userFilter === "Alunos"
                  ? "bg-primary text-card dark:text-card-foreground"
                  : "bg-muted dark:text-card-foregroundr"
              }`}
              onClick={() => setUserFilter("Alunos")}
            >
              Alunos
            </button>
            <button
              className={`py-2 rounded-r-md px-4 text-center ${
                userFilter === "Professores"
                  ? "bg-primary text-card dark:text-card-foreground"
                  : "bg-muted dark:text-card-foreground"
              }`}
              onClick={() => setUserFilter("Professores")}
            >
              Professores
            </button>
          </div>

          <h2 className="ml-4 text-2xl font-semibold mb-4 text-card-foreground">
            {userFilter} da Turma
          </h2>

          <Lista
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            usuarios={filteredUsers}
            setSelectedContact={selectUser}
            tipo={userFilter === "Alunos" ? "star" : "excluir"}
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
