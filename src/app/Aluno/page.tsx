"use client";

import React, { useState } from "react";
import MedModal from "@/components/modal/medModal";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ButtonTT from "@/components/button/ButtonTT";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import FiltrosPesquisa from "@/components/modal/FiltrosPesquisa";
import BackgroundDevolutiva from "@/components/ui/background-devolutiva";

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

const conselhos: Conselho[] = [
  {
    id: 1,
    periodo: "03/2024 até 04/2024",
    status: "Publicado",
    feedback: {
      pontosFortes: "Demonstra liderança em projetos de grupo.",
      oportunidades: "Melhorar habilidades de apresentação.",
      sugestoes: "Participar de workshops relacionados à área.",
    },
  },
  {
    id: 2,
    periodo: "09/2024 até 10/2024",
    status: "Publicado",
    feedback: {
      pontosFortes: "Excelente comprometimento com as atividades.",
      oportunidades: "Poderia aprimorar a escrita técnica.",
      sugestoes: "Explorar projetos de extensão.",
    },
  },
  {
    id: 3,
    periodo: "01/2025 até 03/2025",
    status: "Publicado",
    feedback: {
      pontosFortes: "Faz protótipos detalhados e funcionais.",
      oportunidades: "Melhorar no gerenciamento de tempo.",
      sugestoes: "Participar de eventos de design.",
    },
  },
  {
    id: 4,
    periodo: "05/2025 até 07/2025",
    status: "Publicado",
    feedback: {
      pontosFortes: "Bom desempenho em grupo e ótima comunicação.",
      oportunidades:
        "Precisa melhorar na entrega de trabalhos dentro do prazo.",
      sugestoes: "Participar mais nas discussões em sala.",
    },
  },
];

interface DevolutivaAlunoProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback | null;
  periodo?: string;
}

function DevolutivaAluno({
  isOpen,
  onClose,
  feedback,
  periodo,
}: DevolutivaAlunoProps) {
  return (
    <aside
      className={cn(
        // 🔥 aside fixo na lateral, abaixo do header
        "fixed top-[5rem] right-0 z-10 flex flex-col w-full lg:w-[480px] h-[calc(100vh-5rem)] p-6",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <Card className="h-full border-t-0 shadow-md bg-white">
        <CardHeader className="flex flex-col items-start justify-between relative">
          <CardTitle className="font-title text-accent-foreground text-lg mb-1">
            Conselho Publicado
          </CardTitle>
          <span className="text-sm text-muted-foreground mb-4">
            {periodo || "Período não informado"}
          </span>
          <ButtonTT
            className="absolute top-8 right-12"
            variant="ghost"
            mode="small"
            onClick={onClose}
            icon="IoClose"
            tooltip="none"
          />
        </CardHeader>

        <CardContent className="overflow-auto">
          {!feedback ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-center">
              Nenhum conselho selecionado!
            </div>
          ) : (
            <div className="grid gap-4">
              <div>
                <Label>Pontos Fortes</Label>
                <Textarea
                  value={feedback.pontosFortes}
                  readOnly
                  className="resize-none"
                />
              </div>
              <div>
                <Label>Oportunidades de Melhoria</Label>
                <Textarea
                  value={feedback.oportunidades}
                  readOnly
                  className="resize-none"
                />
              </div>
              <div>
                <Label>Sugestões</Label>
                <Textarea
                  value={feedback.sugestoes}
                  readOnly
                  className="resize-none"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}

export default function AlunoHome() {
  const [selectedConselho, setSelectedConselho] = useState<number | null>(null);
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState<"recente" | "antigo">("recente");
  const [anoFiltro, setAnoFiltro] = useState<string>("");

  let conselhosFiltrados = conselhos.filter((c) =>
    c.periodo.toLowerCase().includes(filtro.toLowerCase())
  );

  if (anoFiltro) {
    conselhosFiltrados = conselhosFiltrados.filter((c) =>
      c.periodo.includes(anoFiltro)
    );
  }

  conselhosFiltrados.sort((a, b) => {
    const anoA = parseInt(a.periodo.split("/")[1]);
    const anoB = parseInt(b.periodo.split("/")[1]);
    return ordenacao === "recente" ? anoB - anoA : anoA - anoB;
  });

  const conselhoSelecionado = conselhos.find(
    (c) => c.id === selectedConselho
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#f5f5f5]">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4 text-primary">
          Meus Conselhos
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2">
          <Input
            type="text"
            placeholder="Pesquisar conselho por período..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="sm:max-w-sm bg-white shadow-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white shadow-sm hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <FiltrosPesquisa
                onSortChange={(valor) => setOrdenacao(valor)}
                onYearChange={(ano) => setAnoFiltro(ano)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conselhosFiltrados.length > 0 ? (
            conselhosFiltrados.map((c) => (
              <MedModal
                key={c.id}
                courseCode={c.periodo}
                courseName="Conselho"
                onClick={() => setSelectedConselho(c.id)}
                className={`transition-transform hover:scale-[1.02] cursor-pointer ${
                  selectedConselho === c.id
                    ? "ring-2 ring-primary scale-[1.02]"
                    : ""
                }`}
              >
                <div className="text-muted-foreground text-right">
                  <span className="font-semibold">Status:</span> {c.status}
                </div>
              </MedModal>
            ))
          ) : (
            <div className="text-center text-muted-foreground mt-6">
              Nenhum conselho encontrado!
            </div>
          )}
        </div>
      </div>

      {/* Painel lateral fixo */}
      <BackgroundDevolutiva>
        <DevolutivaAluno
          isOpen={selectedConselho !== null}
          onClose={() => setSelectedConselho(null)}
          feedback={conselhoSelecionado?.feedback ?? null}
          periodo={conselhoSelecionado?.periodo}
        />
      </BackgroundDevolutiva>
    </div>
  );
}
