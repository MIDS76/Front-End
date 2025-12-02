"use client";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useParams } from "next/navigation";
import TurmaForm from "@/components/turma/TurmaForm";
import { useRouter } from "next/navigation";
import InfoCard from "@/components/card/cardTituloTelas";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "@/app/access-denied";
import BlocoUsuarios from "@/components/modal/BlocoUsuarios";
import { useEffect, useState } from "react";
import { Turma, Usuario } from "@/utils/types";
import { buscarTurmas } from "@/api/turmas";
import { buscarAlunosPorTurma } from "@/api/alunos";

export default function GerenciarTurma() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [alunosDaTurmaOriginal, setAlunosDaTurmaOriginal] = useState<Usuario[]>([]);
  
  const [turma, setTurma] = useState<Turma | undefined>(undefined);
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const turmaId = Number(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isNaN(turmaId) || turmaId <= 0) {
            console.warn("ID da turma inválido ou não disponível.");
            return;
        }

        const alunos = await buscarAlunosPorTurma(turmaId);
        
        setAlunosDaTurmaOriginal(alunos || []);
        setUsuarios(alunos || []); 

        const turmasArray = await buscarTurmas();
        const turmaEncontrada = turmasArray?.find((t) => t.id === turmaId);
        setTurma(turmaEncontrada);

      } catch (error) {
        console.error("Erro ao carregar dados da turma e alunos.", error);
        setAlunosDaTurmaOriginal([]);
        setUsuarios([]);
        toast.error("Falha ao carregar alunos.");
      }
    };

    fetchData();
  }, [turmaId]);


  const handleAplicarFiltroUsuario = async (grupo: string, valor: string) => {
    if (grupo !== "Usuario") return;

    let dadosNovos: Usuario[] = [];
    let listaBase = [...alunosDaTurmaOriginal]; 

    try {
      if (valor === "A-Z") {
        dadosNovos = listaBase.sort((a, b) => a.nome.localeCompare(b.nome));
      } else if (valor === "Z-A") {
        dadosNovos = listaBase.sort((a, b) => b.nome.localeCompare(a.nome));
      } else if (valor === "Ativo") {
        dadosNovos = listaBase.filter(aluno => !aluno.ativo);
      } else if (valor === "Inativo") {
        dadosNovos = listaBase.filter(aluno => !!aluno.ativo);
      } else {
        dadosNovos = alunosDaTurmaOriginal;
      }
      
      setUsuarios(dadosNovos);

    } catch (error) {
      console.error("Erro ao aplicar filtro de usuário:", error);
      setUsuarios(alunosDaTurmaOriginal); 
    }
  };

  if (user?.role !== "pedagogico" && user?.role !== "admin") {
    return AccessDeniedPage();
  }

  if (!turma && turmaId) {
    return (
      <ProtectedRoute>
        <div className="p-6 text-center text-gray-500 pt-32">Carregando dados da turma...</div>
      </ProtectedRoute>
    );
  }
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
              codigoTurma: turma?.nome ?? "",
              nomeCurso: turma?.curso ?? "",
              dataInicio: 
                turma?.dataInicio instanceof Date 
                  ? turma.dataInicio.toISOString().substring(0, 10) 
                  : (turma?.dataInicio || ""),
              dataFim: 
                turma?.dataFinal instanceof Date 
                  ? turma.dataFinal.toISOString().substring(0, 10) 
                  : (turma?.dataFinal || "")
            }}
            onSubmit={() => {
              toast.success("Turma atualizada com sucesso!");
            }}
          />
        </div>

        {/* COLUNA DIREITA — BLOCO DE USUÁRIOS */}
        <div className="flex w-full laptop:w-1/2">
        <BlocoUsuarios
            usuarios={usuarios} 
            searchQuery={searchQueryUsuarios}
            setSearchQuery={setSearchQueryUsuarios}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            scrollHeight="26.5rem"
            onAplicarFiltro={handleAplicarFiltroUsuario}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}