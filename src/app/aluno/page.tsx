'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ButtonTT from "@/components/button/ButtonTT";
import { cn } from "@/lib/utils";
import BackgroundDevolutiva from "@/components/ui/background-devolutiva";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "../access-denied";
import InfoCard from "@/components/card/cardTituloTelas";

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

// ------------------ MOCK ------------------
const conselhos: Conselho[] = [
  {
    id: 1,
    titulo: "MI 78",
    periodo: "03/2024 - 04/2024",
    status: "Concluído",
    feedback: {
      pontosFortes: "Demonstra liderança em projetos de grupo.",
      oportunidades: "Pode desenvolver mais segurança ao expor ideias em público.",
      sugestoes: "Participar de workshops de comunicação.",
    },
  },
  {
    id: 2,
    titulo: "MI 79",
    periodo: "05/2024 - 06/2024",
    status: "Concluído",
    feedback: {
      pontosFortes: "Excelente capacidade analítica.",
      oportunidades: "Desenvolver habilidades de trabalho em equipe.",
      sugestoes: "Participar de grupos colaborativos.",
    },
  },
  {
    id: 3,
    titulo: "MI 80",
    periodo: "07/2024 - 08/2024",
    status: "Em Andamento",
    feedback: null,
  },
  {
    id: 4,
    titulo: "MI 81",
    periodo: "09/2024 - 10/2024",
    status: "Agendado",
    feedback: null,
  },
];

// ------------------ COMPONENTE: PAINEL LATERAL ------------------
function DevolutivaAluno({ isOpen, onClose, feedback, periodo }: any) {
  const { user } = useAuth();

  // Se quiser testar sem login, comente essa linha abaixo temporariamente
  if (user?.role !== "aluno" && user?.role !== "admin") return <AccessDeniedPage />;

  return (
    <aside
      className={cn(
        "fixed top-[6rem] right-0 z-50 w-[360px] sm:w-[420px] md:w-[480px] lg:w-[500px]",
        "h-[calc(100vh-6rem)] bg-[#F1F5F9] shadow-2xl border-l border-slate-200",
        "transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* HEADER DA SIDEBAR + FECHAR */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Conselho Publicado</h2>
           <p className="text-sm text-slate-500 mt-1">{periodo}</p>
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
          className="text-slate-400 hover:text-slate-700"
        />
      </div>

      {/* SELETOR TURMA / INDIVIDUAL */}
      <div className="px-6 py-4 bg-white">
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button className="flex-1 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-md transition-colors">
            Turma
            </button>
            <button className="flex-1 py-1.5 text-sm font-bold text-[#2A5C61] bg-white shadow-sm rounded-md transition-all">
            Individual
            </button>
        </div>
      </div>

      {/* CONTEÚDO SCROLLÁVEL */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
          {/* PONTOS FORTES */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-slate-700">
              Pontos fortes
            </Label>
            <Textarea
              readOnly
              value={feedback?.pontosFortes || "Aguardando publicação do conselho."}
              className="min-h-[120px] bg-white border-slate-200 resize-none text-slate-600 focus-visible:ring-[#2A5C61]"
            />
          </div>

          {/* OPORTUNIDADES */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-slate-700">
              Oportunidades de Melhoria
            </Label>
            <Textarea
              readOnly
              value={feedback?.oportunidades || "Aguardando publicação do conselho."}
              className="min-h-[120px] bg-white border-slate-200 resize-none text-slate-600 focus-visible:ring-[#2A5C61]"
            />
          </div>

          {/* SUGESTÕES */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-slate-700">
              Sugestões
            </Label>
            <Textarea
              readOnly
              value={feedback?.sugestoes || "Aguardando publicação do conselho."}
              className="min-h-[120px] bg-white border-slate-200 resize-none text-slate-600 focus-visible:ring-[#2A5C61]"
            />
          </div>
      </div>
    </aside>
  );
}

// ------------------ PAGE PRINCIPAL ------------------
export default function Page() {
  const [selectedConselho, setSelectedConselho] = useState<number | null>(null);

  const conselhoSelecionado = conselhos.find((c) => c.id === selectedConselho);

  return (
    <div className="min-h-screen pt-24 px-8 pb-10 bg-[#F2F4F5]">
      
      {/* BANNER PRINCIPAL */}
      <div className="max-w-[520px] mb-10">
        <InfoCard
          titulo="Meus Conselhos"
          subtitulo="Centro de Gerenciamento de conselhos"
          descricao=""
          className="shadow-sm border-l-4 border-[#2A5C61]"
        />
      </div>

      {/* LISTA DE CARDS - Grid Responsivo */}
      <div className="flex flex-wrap gap-6">
        {conselhos.map((c) => (
          <div 
            key={c.id} 
            className="flex-shrink-0"
            onClick={() => setSelectedConselho(c.id)}
          >
            {/* CARD CUSTOMIZADO */}
            <div className="group cursor-pointer flex flex-col w-[304px] h-[148px] rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white">
                
                {/* Parte Superior (Verde) */}
                <div className="bg-[#2A5C61] p-4 h-[103px] flex flex-col justify-center gap-1 relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                    <h3 className="text-xl font-bold text-white tracking-wide">
                     {c.titulo}
                   </h3>
                   <span className="text-xs text-white/70 font-medium uppercase tracking-wider">
                     {c.periodo}
                   </span>
                </div>

                {/* Parte Inferior (Branca) */}
                <div className="p-3 border-t border-slate-100 flex items-center h-[45px]">
                   <p className="text-xs font-bold text-slate-700">
                      Status: <span className="text-slate-900 font-normal ml-1">{c.status}</span>
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
          feedback={conselhoSelecionado?.feedback}
          periodo={conselhoSelecionado?.periodo}
        />
      </BackgroundDevolutiva>
    </div>
  );
}
