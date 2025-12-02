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
import BlocoUsuarios from "@/components/modal/BlocoUsuarios";
import { useState } from "react";

export default function GerenciarTurma() {
  const usuariosArray = usuarios;
  const turmasArray = turmas;
  const { id } = useParams();
  const router = useRouter();

  const turmaId = Number(id);
  const turma = turmasArray.find((t) => t.id === turmaId);

  const { user } = useAuth();

  if (user?.role !== "pedagogico" && user?.role !== "admin") {
    return AccessDeniedPage();
  }

  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div
        className="
          flex flex-col gap-6 w-full min-h-screen p-6 
          tablet:flex-col 
          laptop:flex-row
          desktop:flex-row
          desktop:pt-[9rem] desktop:px-16
          laptop:pt-[6rem] laptop:px-12
          tablet:pt-[6rem]
        "
      >

        {/* COLUNA ESQUERDA */}
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

        {/* COLUNA DIREITA — BLOCO DE USUÁRIOS */}
        <div className="flex w-full laptop:w-1/2">
          <BlocoUsuarios
            usuarios={usuariosArray}
            searchQuery={searchQueryUsuarios}
            setSearchQuery={setSearchQueryUsuarios}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            scrollHeight="26.5rem"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
