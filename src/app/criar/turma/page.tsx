"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, UploadCloud } from "lucide-react";
import Lista, { Usuario } from "@/components/lista";
import { toast } from "sonner";
import TextField from "@/components/input/textField";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import * as XLSX from "xlsx";

export default function CriarTurma() {
  const allUsers: Usuario[] = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    nome: `Usuário ${index + 1}`,
    email: `usuario${index + 1}@email.com`,
    role: "aluno",
  }));

  const [userFilter, setUserFilter] = useState("Alunos");
  const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]);
  const [importedUsers, setImportedUsers] = useState<Usuario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "Criando Turma - ConselhEXPERT";
  }, []);

  const selectUser = (user: Usuario) => {
    setSelectedUsers((prev) =>
      !prev.some((u) => u.email === user.email) ? [...prev, user] : prev
    );
  };

  const removeSelectedUser = (user: Usuario) => {
    setSelectedUsers((prev) => prev.filter((u) => u.email !== user.email));
  };

  // --- Importar planilha
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const validUsers: Usuario[] = jsonData
        .filter((row) => row.nome && row.email)
        .map((row, index) => ({
          id: Date.now() + index,
          nome: row.nome,
          email: row.email,
          role: "aluno",
        }));

      if (validUsers.length === 0) {
        toast.error("Nenhum aluno válido encontrado na planilha.");
        return;
      }

      setImportedUsers(validUsers);
      toast.success(`${validUsers.length} alunos importados com sucesso!`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao ler a planilha. Verifique o formato do arquivo.");
    }
  };

  // --- Confirmar importação
  const confirmarImportacao = () => {
    setSelectedUsers((prev) => {
      const novos = importedUsers.filter(
        (u) => !prev.some((p) => p.email === u.email)
      );
      return [...prev, ...novos];
    });
    setImportedUsers([]);
    toast.success("Alunos importados adicionados à turma!");
  };

  return (
    <ProtectedRoute>
      <div className="p-[6%]">
        <div className="flex flex-col md:flex-row gap-6">
          {/* LADO ESQUERDO */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="p-6 pb-0 w-full mt-10 h-full flex flex-col bg-card rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Criar Turma
              </h2>

              <div className="bg-muted/70 rounded-lg mb-5 p-4">
                <h3 className="font-medium text-card-foreground">Resumo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Professores: <b>5</b> | Alunos selecionados:{" "}
                  <b>{selectedUsers.length}</b>
                </p>
              </div>

              <div className="mb-4">
                <TextField
                  label="Nome da Turma"
                  type="text"
                  id="className"
                  placeholder="Ex: MI 74"
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

              {/* Importar Planilha */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-card-foreground mb-2">
                  Importar Alunos via Planilha
                </h3>

                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 w-full cursor-pointer border-2 border-dashed border-border rounded-lg p-4 hover:bg-muted transition-colors"
                >
                  <UploadCloud className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Clique para selecionar ou arraste um arquivo (.xlsx / .csv)
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>

                {importedUsers.length > 0 && (
                  <div className="mt-4 bg-muted/50 border border-border rounded-lg p-3">
                    <p className="text-sm font-medium text-card-foreground mb-2">
                      Pré-visualização ({importedUsers.length} alunos)
                    </p>
                    <div className="max-h-32 overflow-y-auto text-sm space-y-1">
                      {importedUsers.slice(0, 5).map((u) => (
                        <div key={u.email}>
                          <span className="font-medium">{u.nome}</span> -{" "}
                          <i className="text-muted-foreground">{u.email}</i>
                        </div>
                      ))}
                      {importedUsers.length > 5 && (
                        <p className="text-muted-foreground text-xs mt-1">
                          ... e mais {importedUsers.length - 5} alunos
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      onClick={confirmarImportacao}
                    >
                      Confirmar Importação
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-auto pb-6">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Turma criada com sucesso!");
                    setTimeout(() => router.back(), 1500);
                  }}
                >
                  Criar Turma
                </Button>
              </div>
            </div>
          </div>

          {/* LADO DIREITO */}
          <div className="w-full md:w-2/4 px-2 mt-10">
            <div className="ml-4 flex mb-4 w-1/2 rounded-md overflow-hidden border border-border">
              <button
                className={`py-2 px-4 text-center w-1/2 transition-colors ${
                  userFilter === "Alunos"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setUserFilter("Alunos")}
              >
                Alunos
              </button>
              <button
                className={`py-2 px-4 text-center w-1/2 transition-colors ${
                  userFilter === "Professores"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setUserFilter("Professores")}
              >
                Professores
              </button>
            </div>

            {/* Usuários Selecionados */}
            {selectedUsers.length > 0 && (
              <div className="mb-5 ml-4 bg-muted/50 rounded-lg p-3 border border-border">
                <h2 className="text-lg font-semibold mb-2 text-card-foreground">
                  Selecionados
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center bg-card border border-border rounded-md px-2 py-1 text-sm shadow-sm"
                    >
                      <span className="mr-2">{user.nome}</span>
                      <button
                        onClick={() => removeSelectedUser(user)}
                        className="text-muted-foreground hover:text-destructive transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Usuários */}
            <h2 className="ml-4 text-2xl font-semibold mb-4 text-card-foreground">
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
