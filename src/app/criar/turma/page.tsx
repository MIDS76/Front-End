"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import TurmaForm from "@/components/turma/TurmaForm";
import InfoCard from "@/components/card/cardTituloTelas";
import LogLateral from "@/components/sidebar/logLateral";
import ImportarCSV from "@/components/modal/importarCSV";
import { useState } from "react";

export default function CriarTurma() {
  const [alunos, setAlunos] = useState<any[]>([]);

  function handleRemover(idOuNome: string) {
    setAlunos((prev) =>
      prev.filter(
        (s) => s.id !== idOuNome && s.nome !== idOuNome
      )
    );
  }

  return (
    <ProtectedRoute>
      <div
        className="
          flex min-h-screen
          bg-[hsl(var(--background))]
          text-[hsl(var(--foreground))]
          desktop:items-stretch
          laptop:items-stretch
        "
      >
        {/* CONTEÚDO PRINCIPAL */}
        <div
          className="
            flex flex-col
            w-full
            mt-28 p-6 gap-10

            laptop:flex-row laptop:items-start laptop:justify-center 
            desktop:flex-row desktop:items-start desktop:justify-between

            desktop:pl-20
          "
        >
          {/* LADO ESQUERDO — Card + Form */}
          <div className="flex flex-col gap-4 w-full laptop:w-auto items-center desktop:w-auto">
            {/* Card */}
            <div className="w-full laptop:w-[46rem] desktop:w-[46rem]">
              <InfoCard
                titulo="Criar nova turma"
                subtitulo="Resumo"
                descricao={`Alunos ativos: ${alunos.length}`}
              />
            </div>

            {/* Form */}
            <div className="w-full laptop:w-[46rem] desktop:w-[46rem]">
              <TurmaForm
                title="Criar Turma"
                onSubmit={() => {
                  if(alunos.length === 0) {
                    toast.error("Adicione alunos à turma antes de criar!");
                    return;
                  }
                  toast.success("Turma criada com sucesso!");
                }}
              />
            </div>
          </div>

          {/* LADO DIREITO — CSV */}
          <div
            className="
              w-full
              laptop:w-auto
              desktop:w-auto 
              flex justify-center laptop:justify-start
              laptop:mr-0 laptop:ml-[-1.5rem]
              desktop:mr-[2rem]
            "
          >
            <ImportarCSV
              isOpen={true}
              setOpen={() => {}}
              width="36rem"
              height="34rem"
              onImported={(listaAlunos) => {
                setAlunos(listaAlunos);
                toast.success("Lista de alunos importada!");
              }}
            />
          </div>
        </div>

        {/* LOG LATERAL */}
        <LogLateral
          titulo="Alunos"
          itens={alunos.map((a) => ({
          id: a.matricula,
          unidade: a.nome,
          professor: a.email,
        }))}
          vazioTexto="Nenhum aluno selecionado"
          onRemover={handleRemover}
          onProximo={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
