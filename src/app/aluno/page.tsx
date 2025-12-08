"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ButtonTT from "@/components/button/ButtonTT";
import { cn } from "@/lib/utils";
import BackgroundDevolutiva from "@/components/ui/background-devolutiva";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "../access-denied";
import InfoCard from "@/components/card/cardTituloTelas";
import MedModal from "@/components/modal/medModal";

// ------------------ TIPOS ------------------
interface Feedback {
  pontosFortes: string;
  oportunidades: string;
  sugestoes: string;
}

interface Conselho {
  id: number;
  titulo: string;
  periodo: string;
  status: string;
  feedback: Feedback | null;
}

// ------------------ MOCK DE DADOS ------------------
const feedbackTurmaMock: Feedback = {
  pontosFortes: "A turma apresenta boa coesão e participação nas aulas práticas.",
  oportunidades: "Melhorar a pontualidade na entrega de trabalhos em grupo.",
  sugestoes: "Realizar mais dinâmicas de integração."
};

const conselhos: Conselho[] = [
  {
    id: 1,
    titulo: "03/2024 - 04/2024",
    periodo: "",
    status: "Concluído",
    feedback: {
      pontosFortes: "Demonstra liderança em projetos de grupo.",
      oportunidades: "Pode desenvolver mais segurança ao expor ideias em público.",
      sugestoes: "Participar de workshops de comunicação.",
    },
  },
  {
    id: 2,
    titulo: "05/2024 - 06/2024",
    periodo: "",
    status: "Concluído",
    feedback: {
      pontosFortes: "Excelente capacidade analítica.",
      oportunidades: "Desenvolver habilidades de trabalho em equipe.",
      sugestoes: "Participar de grupos colaborativos.",
    },
  },
  {
    id: 3,
    titulo: "07/2024 - 08/2024",
    periodo: "",
    status: "Em Andamento",
    feedback: null,
  },
];

function DevolutivaAluno({ isOpen, onClose, feedbackIndividual, periodo }: any) {
  const { user } = useAuth();
  
  // ESTADO PARA CONTROLAR A VISUALIZAÇÃO
  const [tipoVisualizacao, setTipoVisualizacao] = useState<"individual" | "turma">("individual");

  if (user?.role !== "aluno" && user?.role !== "admin") return <AccessDeniedPage />;

  const feedbackAtivo = tipoVisualizacao === "individual" ? feedbackIndividual : feedbackTurmaMock;

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
            <p className="text-[0.875rem] text-slate-600 mt-[0.0625rem]">{periodo}</p>
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
          {/* PONTOS FORTES */}
          <div className="space-y-2">
            <Label className="text-[1rem] font-bold text-[#2A5C61]">
              Pontos fortes ({tipoVisualizacao === "individual" ? "Aluno" : "Turma"})
            </Label>
            <Textarea
              readOnly
              value={feedbackAtivo?.pontosFortes || "Sem dados para exibir."}
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
              value={feedbackAtivo?.oportunidades || "Sem dados para exibir."}
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
              value={feedbackAtivo?.sugestoes || "Sem dados para exibir."}
              className="min-h-[7.5rem] bg-slate-50 border-slate-200 resize-none text-slate-700 focus-visible:ring-[#2A5C61]"
            />
          </div>
        </div>

      </div>
    </aside>
  );
}

// ------------------ PAGE PRINCIPAL ------------------
export default function Page() {
  const [selectedConselho, setSelectedConselho] = useState<number | null>(null);
  const [showMedModal, setShowMedModal] = useState<boolean>(false);

  const conselhoSelecionado = conselhos.find((c) => c.id === selectedConselho);

  return (
    <div className="min-h-screen pt-[6rem] px-[2rem] pb-[2.5rem] bg-[#F2F4F5]">
      {/* BANNER PRINCIPAL */}
      <div className="max-w-[32.5625rem] mt-[4rem] ml-[2.5rem]">
        <InfoCard
          titulo="Meus Conselhos"
          subtitulo="Centro de Gerenciamento de conselhos"
          descricao=""
          className="shadow-sm   w-[32.5625rem] h-[6.4375rem] mb-[4rem]"
        />
      </div>

      {/* LISTA DE MEDMODAL */}
      <div className="flex flex-wrap gap-[1.5rem] ml-[2.5rem]">
        {conselhos.map((c) => (
          <div key={c.id} className="flex-shrink-0" onClick={() => setSelectedConselho(c.id)}>
            {/* MEDMODAL CUSTOMIZADO */}
            <div className="group cursor-pointer flex flex-col w-[19rem] h-[7.50rem] rounded-[0.625rem] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white ">
              <div className="bg-[#2A5C61] p-[1rem] h-[6.4375rem] flex flex-col justify-center gap-[0.25rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                {/* Alteração: O Período fica em cima da data */}
                <Label className="text-[0.875rem] text-white pt-1">Período</Label>
                <h3 className="text-[1.25rem] font-bold text-white tracking-wide">{c.titulo}</h3>
                <span className="text-[0.875rem] text-white/70 font-medium uppercase tracking-wider">
                  {c.periodo}
                </span>
              </div>
              <div className="p-[0.75rem] border-t border-slate-100 flex items-center h-[2.8125rem]">
                <p className="text-[0.875rem] font-bold text-slate-700">
                  Status: <span className="text-slate-900 font-normal ml-[0.0625rem]">{c.status}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAINEL LATERAL */}
      <BackgroundDevolutiva isOpen={selectedConselho !== null}>
        <DevolutivaAluno
          isOpen={selectedConselho !== null}
          onClose={() => setSelectedConselho(null)}
          feedbackIndividual={conselhoSelecionado?.feedback}
          periodo={conselhoSelecionado?.periodo}
        />
      </BackgroundDevolutiva>

    </div>
  );
}
