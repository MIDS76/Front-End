"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import TurmaForm from "@/components/turma/TurmaForm";
import { Usuario } from "@/utils/types";
import { useRouter } from "next/navigation";
import InfoCard from "@/components/card/cardTituloTelas";
import ImportarCSV from "@/components/modal/importarCSV";
import { useState } from "react";
import { Aluno, associarAlunosTurma, criarAlunos, criarTurma, excluirTurma } from "@/api/turmas";
import { Turma } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CriarTurma() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth(); 

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

    setIsLoading(true);

    try {
      // Cria a turma
      const turma = await criarTurma(form);
      if (!turma) {
        toast.error("Erro ao criar a turma.");
        setIsLoading(false);
        return;
      }

      // Cria os alunos
      const alunosCriados = await criarAlunos(alunos);
      if (!alunosCriados || alunosCriados.length === 0) {
        await excluirTurma(turma.id);
        toast.error("Erro ao criar a lista de alunos. Verifique os dados!");
        setIsLoading(false);
        return;
      }

      // Associa os alunos à turma
      const idsAlunos = alunosCriados.map((a: Aluno) => a.id);
      const associarResponse = await associarAlunosTurma({ idTurma: turma.id, idsAlunos });

      if (associarResponse) {
        toast.success("Turma e alunos criados com sucesso!");
        router.push(`/${user?.role}`);
      }
    } catch (error) {
      // Se as funções de API relançarem o erro (throw err), ele será capturado aqui
      console.error("Erro durante o processo de criação:", error);
      toast.error("Erro durante o processo de criação da turma ou dos alunos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">

        {/* ÁREA PRINCIPAL */}
        <div
          className="
            flex 
            flex-col laptop:flex-row

            w-full 
            max-w-[110rem]    
            mx-auto            
      
            gap-10
            mt-[5rem] 
            p-10    

            pr-[26rem]          
          "
        >
          {/* ESQUERDA — Card + Form */}
          <div className="flex flex-col gap-6 w-full laptop:w-[36rem]">
            <InfoCard
              titulo="Criar nova turma"
              subtitulo="Resumo"
              descricao="Alunos ativos: 0"
            />

            {/* Form */}
            <div className="w-full laptop:w-[46rem] desktop:w-[46rem]">
              <TurmaForm
                title="Criar Turma"
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
            <TurmaForm
              title="Criar Turma"
              onSubmit={() => {
                toast.success("Turma criada com sucesso!");
              }}
            />
          </div>

          {/* DIREITA — CSV */}
          <div
            className="
              w-full 
              laptop:w-[28rem]
              flex justify-center
              laptop:items-start

              desktop:ml-[8rem]       
              desktop:mt-[2rem]
              
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
              setOpen={() => {}}
              width="28rem"
              height="32rem"
              onImported={() => {
                toast.success("Lista de alunos importada com sucesso!");
              }}
            />
          </div>

        </div>

        {/* LOG LATERAL FIXO */}
        <div
          className="
            hidden tablet:flex
            w-[25rem]
            flex-shrink-0

            fixed
            right-0
            top-20
            bottom-0
            z-40
          "
        >
          <LogLateral
            titulo="Listar Todos"
            itens={[]}
            vazioTexto="Nenhum aluno selecionado"
            onRemover={() => {}}
            onProximo={() => {}}
            mostrarProximo={false}
          />
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
