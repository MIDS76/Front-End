"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import TurmaForm from "@/components/turma/TurmaForm";
import InfoCard from "@/components/card/cardTituloTelas";
import LogLateral from "@/components/sidebar/logLateral";
import ImportarCSV from "@/components/modal/importarCSV";

export default function CriarTurma() {
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
                descricao="Alunos ativos: 0"
              />
            </div>

            {/* Form */}
            <div className="w-full laptop:w-[46rem] desktop:w-[46rem]">
              <TurmaForm
                title="Criar Turma"
                onSubmit={() => {
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
              onImported={() => {
                toast.success("Lista de alunos importado com sucesso!");
              }}
            />
          </div>
        </div>

        {/* LOG LATERAL */}
        <LogLateral
          titulo="Listar Todos"
          itens={[]}
          vazioTexto="Nenhum aluno selecionado"
          onRemover={() => {}}
          onProximo={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
