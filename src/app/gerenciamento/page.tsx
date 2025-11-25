"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import BlocoTurmas from "@/components/modal/BlocoTurmas";
import BlocoUsuarios from "@/components/modal/BlocoUsuarios";
import { buscarTurmas } from "@/api/turmas";
import { Turma, Usuario } from "@/utils/types";
import { buscarUsuarios } from "@/api/usuarios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FiltrosDinamicos from "@/components/filtros/FiltrosDinamicos";
import {
  ordenarOrdemAlfabeticaTurma,
  filtrarPorCurso,
  filtrarPorAnoEntrada,
  filtrarAlunoOrdemAlfabetica,
  filtrarPorAtividade,
  filtrarConselhoEtapa // Adicione outras funções de filtro
} from "@/api/filtros";


export default function GerenciamentoUsersTurmas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQueryTurmas, setSearchQueryTurmas] = useState("");
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const turmasArray = await buscarTurmas();
      setTurmas(turmasArray || []);

      const usuariosArray = await buscarUsuarios();
      setUsuarios(usuariosArray || []);
    }

    fetchData();
  }, []);

  const handleAplicarFiltro = async (grupo: string, valor: string) => {
    console.log(`Filtro Aplicado (Pai): Grupo=${grupo}, Valor=${valor}`);
    let dadosNovos: any[] = [];
    let tipoDados: 'usuarios' | 'turmas' | 'outros' = 'outros';

    try {
      // Lógica de filtro reintroduzida AQUI
      if (grupo === "Usuario") {
        tipoDados = 'usuarios';
        if (valor === "A-Z" || valor === "Z-A") {
          dadosNovos = await filtrarAlunoOrdemAlfabetica(valor) || [];
        } else { // Ativo/Inativo
          dadosNovos = await filtrarPorAtividade(valor) || [];
        }
      }

      // Lógica de filtro reintroduzida AQUI
      else if (grupo === "Turma" || grupo === "Curso" || grupo === "Ano de Entrada") {
        tipoDados = 'turmas';

        if (valor === "A-Z" || valor === "Z-A") {
          dadosNovos = await ordenarOrdemAlfabeticaTurma(valor) || [];
        } else if (grupo === "Curso") {
          dadosNovos = await filtrarPorCurso(valor) || [];
        } else if (grupo === "Ano de Entrada") {
          dadosNovos = await filtrarPorAnoEntrada(valor) || [];
        }
      }

      else if (grupo === "Conselho") {
        tipoDados = 'outros';
        dadosNovos = await filtrarConselhoEtapa(valor) || [];
      }

      // ✅ CORREÇÃO: ATUALIZA O ESTADO CORRESPONDENTE E MANTÉM O OUTRO!
      if (tipoDados === 'usuarios') {
        setUsuarios(dadosNovos as Usuario[]);
      } else if (tipoDados === 'turmas') {
        setTurmas(dadosNovos as Turma[]);
      } else if (grupo === "Conselho") {
        // Lógica de filtro de conselho
      }

    } catch (error) {
      console.error("Erro ao aplicar filtro:", error);
    }
  };
  const handleTurmaClick = (id: number) => {
    router.push(`/gerenciamento/turma/${id}`);
  };

  return (
    <ProtectedRoute>
      <div className="mt-32 w-full grid gap-10 grid-cols-1 tablet:grid-cols-1 laptop:grid-cols-2 desktop:grid-cols-2 px-10 laptop:max-w-[1350px] laptop:mx-auto">

        <BlocoTurmas
          turmas={turmas}
          searchQuery={searchQueryTurmas}
          setSearchQuery={setSearchQueryTurmas}
          handleTurmaClick={handleTurmaClick}
          onAplicarFiltro={handleAplicarFiltro}
        />

        <BlocoUsuarios
          usuarios={usuarios}
          searchQuery={searchQueryUsuarios}
          setSearchQuery={setSearchQueryUsuarios}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onAplicarFiltro={handleAplicarFiltro}
        />

      </div>
    </ProtectedRoute>
  );
}
