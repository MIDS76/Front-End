"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Lista, { Usuario } from "@/components/lista";
import { toast } from "sonner";
import TextField from "@/components/input/textField";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CriarTurma() {
  const allUsers: Usuario[] = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    nome: `Usuário ${index + 1}`,
    email: `usuario${index + 1}@email.com`,
    role: "aluno",
  }));

  const [userFilter, setUserFilter] = useState("Alunos");
  const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectUser = (user: Usuario) => {
    setSelectedUsers((prev) =>
      !prev.some((u) => u.email === user.email) ? [...prev, user] : prev
    );
  };

  const removeSelectedUser = (user: Usuario) => {
    setSelectedUsers((prev) => prev.filter((u) => u.email !== user.email));
  };

  useEffect(() => {
    document.title = "Criando Turma - ConselhEXPERT";
  }, []);
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <div className="p-6 pb-0 w-full mt-16 h-full flex flex-col">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Criar Turma
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
                  placeholder="Insira o nome curto da turma (ex: MI 74)"
                />
              </div>
              <div className="mb-4">
                <TextField
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
                    toast.success("Turma criada com sucesso!");
                    setTimeout(() => {
                      router.back();
                    }, 1500);
                  }}
                >
                  Criar Turma
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5 px-2 mt-8">
            <div className="ml-4 flex mb-4 rounded-md overflow-hidden">
              <button
                className={`py-2 px-4 text-center  ${userFilter === "Alunos" ? "bg-primary text-card" : "bg-muted"
                  }`}
                onClick={() => setUserFilter("Alunos")}
              >
                Alunos
              </button>
              <button
                className={`py-2 rounded-r-md px-4 text-center ${userFilter === "Professores"
                    ? "bg-primary text-card"
                    : "bg-muted"
                  }`}
                onClick={() => setUserFilter("Professores")}
              >
                Professores
              </button>
            </div>

            {selectedUsers.length > 0 && (
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2 text-card-foreground">
                  Selecionados
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center rounded-r-md bg-muted rounded-md px-2 py-1 text-sm"
                    >
                      <span className="mr-2">{user.nome} </span>
                      <button
                        onClick={() => removeSelectedUser(user)}
                        className="text-card-foreground hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className=" ml-4 text-2xl font-semibold mb-4 text-card-foreground">
              {userFilter} Disponíveis
            </h2>
            <Lista
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              usuarios={allUsers}
              setSelectedContact={selectUser}
              tipo="add"
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
