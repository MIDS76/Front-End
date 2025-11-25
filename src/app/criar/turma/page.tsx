"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import TurmaForm from "@/components/turma/TurmaForm";
import InfoCard from "@/components/card/cardTituloTelas";
import LogLateral from "@/components/sidebar/logLateral";
import ImportarCSV from "@/components/modal/importarCSV";
import { useState } from "react";
import { Aluno, associarAlunosTurma, criarAlunos, criarTurma, excluirTurma } from "@/api/turmas";
import { Turma } from "@/utils/types";

export default function CriarTurma() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmaData, setTurmaData] = useState<Turma>({
    nome: "",
    curso: "",
    dataInicio: "",
    dataFinal: "",
  });

  function handleRemover(idOuNome: string) {
    setAlunos((prev) =>
      prev.filter(
        (s) => s.matricula !== idOuNome && s.nome !== idOuNome
      )
    );
  }

  const handleSubmit = async (form: Turma) => {
    if (alunos.length === 0) {
      toast.error("Adicione alunos à turma antes de criar!");
      return;
    }
  
    try {
      // Cria a turma diretamente com os dados do form
      const turma = await criarTurma(form);
      console.log("Turma criada:", turma);
  
      if (!turma) {
        toast.error("Erro ao criar a turma.");
        return;
      }
  
      // Cria os alunos
      const alunosCriados = await criarAlunos(alunos);
      console.log("Alunos criados:", alunosCriados);
  
      if (!alunosCriados || alunosCriados.length === 0) {
        await excluirTurma(turma.id);
        toast.error("Erro ao criar a lista de alunos. Verifique os dados!");
        return;
      }
  
      // Associa os alunos à turma
      const idsAlunos = alunosCriados.map((a: Aluno) => a.id);
      const associarResponse = await associarAlunosTurma({ idTurma: turma.id, idsAlunos });
  
      if (associarResponse) {
        toast.success("Turma e alunos criados com sucesso!");
      }
    } catch (error) {
      console.error("Erro durante o processo de criação:", error);
      toast.error("Erro durante o processo de criação da turma ou dos alunos.");
    }
  };

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
                onSubmit={handleSubmit}
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
              setOpen={() => { }}
              width="36rem"
              height="34rem"
              onImported={(listaAlunos) => {
                if (listaAlunos.length > 0) {
                  setAlunos(listaAlunos);
                  toast.success("Lista de alunos importada!");
                }
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
          onProximo={() => { }}
        />
      </div>
    </ProtectedRoute>
  );
}
