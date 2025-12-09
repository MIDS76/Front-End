"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ButtonTT from "@/components/button/ButtonTT";
import { cn } from "@/lib/utils";
import BackgroundDevolutiva from "@/components/ui/background-devolutiva";
import AccessDeniedPage from "../access-denied";
import InfoCard from "@/components/card/cardTituloTelas";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import {
  buscarFeedbackConsolidado,
  FeedbackConsolidadoAPI, 
} from "@/api/feedback";

import {
  listarConselhosDoAlunoComResultado,
  ConselhoAlunoList,
} from "@/api/conselho";


const formatarMesAno = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}/${month}`;
};

const traduzirStatus = (statusApi: string | undefined): string => {
  if (!statusApi) return "Em Andamento";

  const statusMap: { [key: string]: string } = {
    "RESULTADO": "Concluído",
    "NAO_INICIADO": "Em Andamento",
    "PRE_CONSELHO": "Em Andamento",
  };

  const chave = statusApi.toUpperCase().trim();
  return statusMap[chave] || "Status Desconhecido";
};

interface FeedbackVisualizacao {
  pontosFortes: string;
  oportunidades: string;
  sugestoes: string;
}

interface ConselhoExibicao extends ConselhoAlunoList {
  periodoFormatado: string; 
  statusExibicao: string; 
}


const mapFeedbackConsolidadoToVisualizacao = (
  apiData: FeedbackConsolidadoAPI | null | undefined, 
  tipo: "individual" | "turma"
): FeedbackVisualizacao => {


  if (!apiData) {
    return {
      pontosFortes: "Sem dados para exibir.",
      oportunidades: "Sem dados para exibir.",
      sugestoes: "Sem dados para exibir."
    };
  }

  if (tipo === "individual") {
    return {
      pontosFortes: apiData.pontosPositivosAluno,
      oportunidades: apiData.pontosMelhoriaAluno,
      sugestoes: apiData.sugestaoAluno,
    };
  } else { 
    return {
      pontosFortes: apiData.pontosPositivosTurma,
      oportunidades: apiData.pontosMelhoriaTurma,
      sugestoes: apiData.sugestaoTurma,
    };
  }
};



function DevolutivaAluno({ isOpen, onClose, conselhoId, periodoFormatado }: { isOpen: boolean, onClose: () => void, conselhoId: number | null, periodoFormatado: string }) {
  const { user } = useAuth();
  const idAluno = user?.id;

  const [tipoVisualizacao, setTipoVisualizacao] = useState<"individual" | "turma">("individual");
  const [feedbackConsolidado, setFeedbackConsolidado] = useState<FeedbackConsolidadoAPI | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const feedbackAtivo = useMemo(() => {
    return mapFeedbackConsolidadoToVisualizacao(feedbackConsolidado, tipoVisualizacao);
  }, [feedbackConsolidado, tipoVisualizacao]);


  useEffect(() => {
    if (!isOpen || !conselhoId || !idAluno) {
      setFeedbackConsolidado(undefined);
      return;
    }

    const loadFeedbacks = async () => {
      setIsLoading(true);
      setFeedbackConsolidado(undefined);

      try {
        const data = await buscarFeedbackConsolidado(conselhoId, idAluno);
        setFeedbackConsolidado(data);

      } catch (error) {
        toast.error("Erro ao carregar detalhes do feedback. Tente novamente.");
        console.error("Falha na busca de Feedback Consolidado (API):", error);
        setFeedbackConsolidado(null); 
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedbacks();
  }, [isOpen, conselhoId, idAluno]);

  if (user?.role !== "aluno" && user?.role !== "admin") return <AccessDeniedPage />;


  return (
    <aside
      className={cn(
        "fixed top-[3.75rem] right-0 z-50",
        "w-[26rem] sm:w-[32rem] md:w-[45rem] lg:w-[55rem] xl:w-[60rem]",
        "h-[calc(100vh-3.75rem)] bg-[#d2dbdc] shadow-2xl border-l border-slate-300 p-[1.25rem]",
        "transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* CARD BRANCO */}
      <div className="bg-white w-full h-full rounded-[1.25rem] shadow-sm flex flex-col overflow-hidden mt-[1rem]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-[1.5rem] pt-[1.5rem] pb-[0.125rem]">
          <div>
            <h2 className="text-[1.25rem] font-bold text-slate-800">Conselho Publicado</h2>
            <p className="text-[0.875rem] text-slate-600 mt-[0.0625rem]">{periodoFormatado}</p>
          </div>
          <ButtonTT
            icon="IoClose"
            tooltip="Fechar"
            variant="ghost"
            mode="text-icon"
            onClick={(e: any) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-slate-500 hover:text-slate-800"
          />
        </div>

        {/* LINHA SEPARADORA SUTIL */}
        <div className="w-full h-[0.0625rem] bg-slate-100 mt-[0.125rem] mb-[1rem] mx-auto max-w-[90%]"></div>

        {/* BOTÕES INTERRUPTOR */}
        <div className="px-[1.5rem] pb-[0.5rem]">
          <div className="flex bg-[#447f88] p-[0.3rem] rounded-[0.80rem] shadow-inner">
            <button
              onClick={() => setTipoVisualizacao("turma")}
              className={cn(
                "flex-1 py-[0.5rem] text-[0.875rem] font-bold rounded-[0.25rem] transition-all duration-200",
                tipoVisualizacao === "turma"
                  ? "bg-white text-[#2A5C61] shadow-sm"
                  : "text-white hover:bg-white/10"
              )}
            >
              Turma
            </button>
            <button
              onClick={() => setTipoVisualizacao("individual")}
              className={cn(
                "flex-1 py-[0.5rem] text-[0.875rem] font-bold rounded-[0.25rem] transition-all duration-200",
                tipoVisualizacao === "individual"
                  ? "bg-white text-[#2A5C61] shadow-sm"
                  : "text-white hover:bg-white/10"
              )}
            >
              Individual
            </button>
          </div>
        </div>

        {/* CONTEÚDO SCROLLÁVEL (TEXTAREAS) */}
        <div className="flex-1 overflow-y-auto px-[1.5rem] pb-[1.5rem] pt-[0.125rem] space-y-[1.25rem]">

          {isLoading ? (
            <div className="flex justify-center items-center h-full min-h-[30rem] text-slate-500">
              <RotateCw className="w-6 h-6 animate-spin mr-2" />
              Carregando feedback...
            </div>
          ) : (
            <>
              {/* PONTOS FORTES */}
              <div className="space-y-2">
                <Label className="text-[1rem] font-bold text-[#2A5C61]">
                  Pontos fortes ({tipoVisualizacao === "individual" ? "Aluno" : "Turma"})
                </Label>
                <Textarea
                  readOnly
                  value={feedbackAtivo.pontosFortes} 
                  className="min-h-[7.5rem] bg-slate-50 border-slate-200 resize-none text-slate-700 focus-visible:ring-[#2A5C61]"
                />
              </div>

              {/* OPORTUNIDADES */}
              <div className="space-y-2">
                <Label className="text-[1rem] font-bold text-[#2A5C61]">
                  Oportunidades de Melhoria
                </Label>
                <Textarea
                  readOnly
                  value={feedbackAtivo.oportunidades} 
                  className="min-h-[7.5rem] bg-slate-50 border-slate-200 resize-none text-slate-700 focus-visible:ring-[#2A5C61]"
                />
              </div>

              {/* SUGESTÕES */}
              <div className="space-y-2">
                <Label className="text-[1rem] font-bold text-[#2A5C61]">
                  Sugestões
                </Label>
                <Textarea
                  readOnly
                  value={feedbackAtivo.sugestoes} 
                  className="min-h-[7.5rem] bg-slate-50 border-slate-200 resize-none text-slate-700 focus-visible:ring-[#2A5C61]"
                />
              </div>
            </>
          )}
        </div>

      </div>
    </aside>
  );
}

export default function Page() {
  const { user } = useAuth();
  const idAluno = user?.id;

  const [conselhos, setConselhos] = useState<ConselhoExibicao[]>([]);
  const [selectedConselhoId, setSelectedConselhoId] = useState<number | null>(null);
  const [isLoadingConselhos, setIsLoadingConselhos] = useState(true);

  const conselhoSelecionado = useMemo(() => {
    return conselhos.find((c) => c.id === selectedConselhoId);
  }, [conselhos, selectedConselhoId]);


  useEffect(() => {

    if (!idAluno) {
      setIsLoadingConselhos(false);
      return;
    }

    const fetchConselhos = async () => {
      setIsLoadingConselhos(true);
      try {
        const data = await listarConselhosDoAlunoComResultado(idAluno);

        const conselhosMapeados: ConselhoExibicao[] = data.map(c => ({
          ...c,
          periodoFormatado: `${formatarMesAno(c.dataInicio)} - ${formatarMesAno(c.dataFim)}`,
          statusExibicao: traduzirStatus(c.etapas)
        }));

        setConselhos(conselhosMapeados);
      } catch (error) {
        toast.error("Falha ao buscar sua lista de conselhos. Tente recarregar a página.");
        setConselhos([]);
      } finally {
        setIsLoadingConselhos(false);
      }
    };

    fetchConselhos();
  }, [idAluno]);

  if (user?.role !== "aluno" && user?.role !== "admin"  && user?.role !== "pedagogico") {
    return <AccessDeniedPage />;
  }

  if (isLoadingConselhos) {
    return (
      <div className="min-h-screen pt-[6rem] px-[2rem] pb-[2.5rem] bg-[#F2F4F5] flex justify-center items-center">
        <p className="text-xl text-slate-600 flex items-center">
          <RotateCw className="w-5 h-5 animate-spin mr-3" />
          Carregando histórico de conselhos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[6rem] px-[2rem] pb-[2.5rem] bg-[#F2F4F5]">
      {/* BANNER PRINCIPAL */}
      <div className="max-w-[32.5625rem] mt-[4rem] ml-[2.5rem]">
        <InfoCard
          titulo="Meus Conselhos"
          subtitulo="Centro de Gerenciamento de conselhos"
          descricao=""
          className="shadow-sm   w-[32.5625rem] h-[6.4375rem] mb-[4rem]"
        />
      </div>

      {/* LISTA DE CONSELHOS */}
      <div className="flex flex-wrap gap-[1.5rem] ml-[2.5rem]">
        {conselhos.length === 0 ? (
          <div className="mt-8 text-lg text-slate-500">
            Nenhum conselho com feedback disponível para visualização no momento.
          </div>
        ) : (
          conselhos.map((c) => (
            <div
              key={c.id}
              className="flex-shrink-0"
              onClick={() => setSelectedConselhoId(c.id)}
            >
              <div className="group cursor-pointer flex flex-col w-[19rem] h-[7.50rem] rounded-[0.625rem] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white ">

                <div className="bg-[#2A5C61] p-[1rem] h-[5.375rem] flex flex-col justify-start gap-[0.25rem] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

                  <Label className="text-[0.875rem] text-white pt-1">Período</Label>

                  <h3 className="text-[1.25rem] font-bold text-white tracking-wide">{c.periodoFormatado}</h3>

                  <span className="text-[0.875rem] text-white/70 font-medium uppercase tracking-wider">
                    {c.titulo}
                  </span>
                </div>

                <div className="p-[0.75rem] border-t border-slate-100 flex items-center h-[2.125rem]">
                  <p className="text-[0.875rem] font-bold text-slate-700">
                    Status:
                    <span className="font-normal text-slate-900 ml-[0.25rem]">{c.statusExibicao}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAINEL LATERAL */}
      <BackgroundDevolutiva isOpen={selectedConselhoId !== null}>
        <DevolutivaAluno
          isOpen={selectedConselhoId !== null}
          onClose={() => setSelectedConselhoId(null)}
          conselhoId={conselhoSelecionado?.id || null}
          periodoFormatado={conselhoSelecionado?.periodoFormatado || ""}
        />
      </BackgroundDevolutiva>

    </div>
  );
}