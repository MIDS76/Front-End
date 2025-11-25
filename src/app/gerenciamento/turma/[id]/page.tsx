"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import usuarios from "@/data/usuarios.json";
import turmas from "@/data/turma.json";
import { useParams } from "next/navigation";
import TurmaForm from "@/components/turma/TurmaForm";
import { useRouter } from "next/navigation";
import InfoCard from "@/components/card/cardTituloTelas";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "@/app/access-denied";

export default function GerenciarTurma() {
  const usuariosArray = usuarios;
  const turmasArray = turmas;
  const { id } = useParams();
  const router = useRouter();

  const alunos = usuariosArray.filter((user) => user.role === "Aluno");
  const turmaId = Number(id);
  const turma = turmasArray.find((t) => t.id === turmaId);

  const { user } = useAuth();
  
  if (user?.role !== "pedagogico" && user?.role !== "admin") {
    return AccessDeniedPage();
  }

  return (
    <ProtectedRoute>
      <div className="flex w-full min-h-screen p-6 gap-6 
      desktop:pt-[9rem] desktop:px-16
      laptop:pt-[6rem] laptop:px-12
      tablet:pt-[6rem]">
        {/* Coluna Esquerda card+form */}
        <div className="flex flex-col gap-6 w-full laptop:w-1/2">
          <InfoCard
            titulo="Gerenciamento de turma"
            subtitulo="Status"
            descricao="Ativa"
          />

          <TurmaForm
            title="Gerenciar Turma"
            initialData={{
              codigoTurma: turma?.codigoTurma ?? "",
              nomeCurso: turma?.nomeCurso ?? "",
              dataInicio: turma?.dataInicio ?? "",
              dataFim: turma?.dataFim ?? "",
            }}
            onSubmit={() => {
              toast.success("Turma atualizada com sucesso!");
            }}
          />
        </div>

        {/* futuro modal de lista - aguardando commit da Júlia Macena */}
        <div className="hidden laptop:flex w-1/2"></div>
      </div>
    </ProtectedRoute>
  );
}
