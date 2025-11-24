"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import TurmaForm from "@/components/turma/TurmaForm";
import { Usuario } from "@/utils/types";
import { useRouter } from "next/navigation";

export default function CriarTurma() {

  const router = useRouter();
  const alunos: Usuario[] = [];
  
  return (
    <ProtectedRoute>
      <TurmaForm
        title="Criar Turma"
        alunos={alunos}
        onSubmit={(form, alunosSelecionados) => {
          toast.success("Turma criada com sucesso!");
        }}
      />
    </ProtectedRoute>
  );
}
