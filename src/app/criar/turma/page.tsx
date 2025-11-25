"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import TurmaForm from "@/components/turma/TurmaForm";
import { Usuario } from "@/utils/types";
import { useRouter } from "next/navigation";
import InfoCard from "@/components/card/cardTituloTelas";
import ImportarCSV from "@/components/modal/importarCSV";
import LogLateral from "@/components/sidebar/logLateral";

export default function CriarTurma() {

  const router = useRouter();
  const alunos: Usuario[] = [];
  
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

      </div>
    </ProtectedRoute>
  );
}
