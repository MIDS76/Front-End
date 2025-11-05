"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import usuarios from "@/data/usuarios.json";
import turmas from "@/data/turma.json";
import { useParams} from "next/navigation";
import TurmaForm from "@/components/turma/TurmaForm";
import { useRouter } from "next/navigation";

export default function GereciarTurma() {
  const usuariosArray = usuarios;
  const turmasArray = turmas;
  const { id } = useParams();

  const router = useRouter();
  const alunos = usuariosArray.filter((user) => user.role === "Aluno");
  const turmaId = Number(id);
  const turma = turmasArray.find((t) => t.id === turmaId);

  return (
    <ProtectedRoute>
      <TurmaForm
        title="Gerenciar Turma"
        initialData={{
          codigoTurma: turma?.codigoTurma ?? "",
          nomeCurso: turma?.nomeCurso ?? "",
          dataIncio: turma?.dataInicio ?? "",
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