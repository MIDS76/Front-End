"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import usuarios from "@/data/usuarios.json";
import turmas from "@/data/turma.json";
import { useParams} from "next/navigation";
import TurmaForm from "@/components/turma/TurmaForm";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "@/app/access-denied";

export default function GereciarTurma() {
  const usuariosArray = usuarios;
  const turmasArray = turmas;
  const { id } = useParams();

  const alunos = usuariosArray.filter((user) => user.role === "Aluno");
  const turmaId = Number(id);
  const turma = turmasArray.find((t) => t.id === turmaId);

  const { user } = useAuth();
  
  if (user?.role !== "pedagogico" && user?.role !== "admin") {
    return AccessDeniedPage();
  }

  return (
    <ProtectedRoute>
      <TurmaForm
        title="Gerenciar Turma"
        initialData={{
          codigoTurma: turma?.codigoTurma ?? "",
          nomeCurso: turma?.nomeCurso ?? "",
          dataInicio: turma?.dataInicio ?? "",
          dataFim: turma?.dataFim ?? "",
        }}
        alunos={alunos}
        onSubmit={(form, alunosSelecionados) => {
          toast.success("Turma atualizada com sucesso!");
        }}
      />
    </ProtectedRoute>
  );
}