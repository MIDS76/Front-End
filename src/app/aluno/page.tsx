'use client';

import React, { useState } from "react";
import MedModal from "@/components/modal/medModal";
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
  periodo: string;
  status: string;
  feedback: Feedback | null;
}

// ------------------ MOCK ------------------
const conselhos: Conselho[] = [
  {
    id: 1,
    periodo: "03/2024 até 04/2024",
    status: "Concluído",
    feedback: {
      pontosFortes: `Demonstra liderança em projetos de grupo.`,
      oportunidades: `Pode desenvolver mais segurança ao expor ideias em público.`,
      sugestoes: `Participar de workshops de comunicação.`,
    },
  },
  {
    id: 2,
    periodo: "05/2024 até 06/2024",
    status: "Concluído",
    feedback: {
      pontosFortes: `Excelente capacidade analítica.`,
      oportunidades: `Desenvolver habilidades de trabalho em equipe.`,
      sugestoes: `Participar de grupos colaborativos.`,
    },
  },
  {
    id: 3,
    periodo: "07/2024 até 08/2024",
    status: "Em Andamento",
    feedback: null,
  },
  {
    id: 4,
    periodo: "09/2024 até 10/2024",
    status: "Agendado",
    feedback: null,
  },
];

// ------------------ COMPONENTE: PAINEL LATERAL ------------------
function DevolutivaAluno({ isOpen, onClose, feedback, periodo }: any) {
  const { user } = useAuth();

  if (user?.role !== "aluno") return <AccessDeniedPage />;

  return (
    <aside
      className={cn(
        "fixed top-[6rem] right-0 z-50 w-[360px] sm:w-[420px] md:w-[480px] lg:w-[500px]",
        "h-[calc(100vh-6rem)] bg-[#D5E0DE] shadow-xl rounded-l-xl",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* BOTÃO FECHAR */}
      <div className="absolute top-4 right-4 z-50">
        <ButtonTT
          icon="IoClose"
          tooltip="none"
          variant="ghost"
          mode="small"
          onClick={(e: any) => {
            e.stopPropagation();
            onClose();
          }}
        />
      </div>

      {/* SELETOR TURMA / INDIVIDUAL */}
      <div className="flex items-center gap-2 p-4">
        <button className="w-1/2 py-1 rounded-md bg-white font-semibold shadow text-sm tablet:text-lg laptop:text-xl desktop:text-2xl hover:bg-[#5a6f68]">
          Turma
        </button>
        <button className="w-1/2 py-1 rounded-md bg-[#6B8583] text-white text-sm tablet:text-lg laptop:text-xl desktop:text-2xl hover:bg-[#5a6f68]">
          Individual
        </button>
      </div>

      <Card className="h-[calc(100%-4rem)] border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-base font-semibold tablet:text-lg laptop:text-xl desktop:text-2xl">
            Conselho Publicado
          </CardTitle>
          <div className="w-full h-[1px] bg-gray-300 mt-1"></div>
          <span className="text-sm text-muted-foreground">{periodo}</span>
        </CardHeader>

        <CardContent className="h-full overflow-y-auto px-4 pb-6 space-y-6">
          {/* PONTOS FORTES */}
          <div>
            <Label className="mb-1 font-semibold tablet:text-lg laptop:text-xl desktop:text-2xl">
              Pontos fortes
            </Label>
            <Textarea
              readOnly
              value={feedback?.pontosFortes || "Aguardando publicação do conselho."}
              className="min-h-[130px] bg-white resize-none text-sm tablet:text-lg laptop:text-xl desktop:text-2xl"
            />
          </div>

          {/* OPORTUNIDADES */}
          <div>
            <Label className="mb-1 font-semibold tablet:text-lg laptop:text-xl desktop:text-2xl">
              Oportunidades de Melhoria
            </Label>
            <Textarea
              readOnly
              value={feedback?.oportunidades || "Aguardando publicação do conselho."}
              className="min-h-[130px] bg-white resize-none text-sm tablet:text-lg laptop:text-xl desktop:text-2xl"
            />
          </div>

          {/* SUGESTÕES */}
          <div>
            <Label className="mb-1 font-semibold tablet:text-lg laptop:text-xl desktop:text-2xl">
              Sugestões
            </Label>
            <Textarea
              readOnly
              value={feedback?.sugestoes || "Aguardando publicação do conselho."}
              className="min-h-[130px] bg-white resize-none text-sm tablet:text-lg laptop:text-xl desktop:text-2xl"
            />
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

// ------------------ PAGE PRINCIPAL ------------------
export default function Page() {
  const [selectedConselho, setSelectedConselho] = useState<number | null>(null);

  const conselhoSelecionado = conselhos.find((c) => c.id === selectedConselho);

  return (
    <div className="min-h-screen pt-24 px-16">
      {/* BANNER PRINCIPAL */}
      <div className="max-w-[520px]">
        <InfoCard
          titulo="Meus Conselhos"
          subtitulo="Centro de Gerenciamento de conselhos"
          descricao=""
          className="shadow-md"
        />
      </div>

      {/* LISTA DE CARDS */}
      <div className="flex overflow-x-auto gap-6 mt-14">
        {conselhos.map((c) => (
          <div key={c.id} className="flex-shrink-0">
            <MedModal
              courseName={c.periodo}
              courseCode={`MI ${78 + c.id}`} // Exemplo para variar o código
              onClick={() => setSelectedConselho(c.id)}
              className="w-[260px]"
            >
              <div className="bg-white p-2 rounded-b-lg text-xs text-muted-foreground">
                <span className="font-semibold">Status:</span> {c.status}
              </div>
            </MedModal>
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
