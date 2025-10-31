"use client";

import React, { useState } from "react";

// Componentes customizados
import MedModal from "@/components/modal/medModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ButtonTT from "@/components/button/ButtonTT";
import { cn } from "@/lib/utils";

// Dropdown e filtros
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import FiltrosPesquisa from "@/components/modal/FiltrosPesquisa";
import BackgroundDevolutiva from "@/components/ui/background-devolutiva";
import { FaFilter } from "react-icons/fa6";

// ------------------ TIPOS ------------------

// Define a estrutura de um feedback
interface Feedback {
  pontosFortes: string;
  oportunidades: string;
  sugestoes: string;
}

// Define a estrutura de um conselho
interface Conselho {
  id: number;
  periodo: string;
  status: string;
  feedback: Feedback | null; // Pode não ter feedback
}

// ------------------ DADOS MOCK ------------------
// Lista de conselhos, normalmente viria de uma API
const conselhos: Conselho[] = [
  {
    id: 1,
    periodo: "03/2024 até 04/2024",
    status: "Publicado",
    feedback: {
      pontosFortes: `Demonstra liderança em projetos de grupo, sempre assumindo a frente na organização de tarefas e incentivando os colegas a atingirem metas com excelência. 
Mostra grande capacidade de comunicação, empatia e resolução de conflitos, mantendo um ambiente colaborativo e produtivo. 
Além disso, apresenta uma visão estratégica notável, antecipando possíveis problemas e propondo soluções práticas e criativas.`,
      oportunidades: `Embora possua uma ótima capacidade técnica, ainda há espaço para evoluir em apresentações orais e comunicação visual dos resultados. 
Em algumas situações, demonstra insegurança ao expor ideias em público, o que pode ser trabalhado com mais prática e autoconfiança. 
Investir tempo em treinar storytelling e oratória poderá fortalecer significativamente sua presença em reuniões e apresentações de projetos.`,
      sugestoes: `Participar de workshops e eventos voltados ao desenvolvimento de habilidades interpessoais e de liderança, especialmente na área de comunicação assertiva e gestão de equipes. 
Além disso, considerar cursos complementares sobre metodologias ágeis e design thinking para aprimorar o raciocínio estratégico e a capacidade de adaptação a diferentes contextos organizacionais.`,
    },
  },
  {
    id: 2,
    periodo: "09/2024 até 10/2024",
    status: "Publicado",
    feedback: {
      pontosFortes: `Excelente capacidade analítica e atenção aos detalhes, sempre buscando compreender profundamente os problemas antes de propor soluções.`,
      oportunidades: `Desenvolver habilidades de trabalho em equipe, buscando mais interação e colaboração com os colegas em projetos conjuntos.`,
      sugestoes: `Participar de grupos de estudo e atividades extracurriculares que envolvam trabalho em equipe para aprimorar essas habilidades sociais.`,
    },
  },
  {
    id: 3,
    periodo: "01/2025 até 03/2025",
    status: "Publicado",
    feedback: {
      pontosFortes: `Demonstra criatividade e inovação em suas abordagens, trazendo novas perspectivas para os desafios enfrentados.`,
      oportunidades: `Aprimorar habilidades técnicas específicas relacionadas à sua área de estudo, como softwares ou ferramentas relevantes.`,
      sugestoes: `Inscrever-se em cursos online ou workshops que ofereçam treinamento prático nessas áreas técnicas.`,
    },
  },
  {
    id: 4,
    periodo: "05/2025 até 07/2025",
    status: "Publicado",
    feedback: {
      pontosFortes: `Bom desempenho em grupo e ótima comunicação e muita proatividade nas atividades propostas.`,
      oportunidades: `Melhorar a gestão do tempo para cumprir prazos com mais eficiência, evitando atrasos em entregas.`,
      sugestoes: `Participar mais nas discussões em sala de aula e buscar feedbacks constantes dos professores para aprimorar o desempenho acadêmico.`,
    },
  },
];

// ------------------ COMPONENTE: DevolutivaAluno ------------------
// Painel lateral que mostra os detalhes do feedback do aluno
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
        // Painel lateral fixo à direita
        "fixed top-[5rem] right-0 z-50 w-full sm:w-[480px] h-[calc(100vh-5rem)] p-4 sm:p-6",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full" // Animação de abrir/fechar
      )}
    >
      {/* Botão de fechar */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-12 z-50 pointer-events-auto">
        <ButtonTT
          variant="ghost"
          mode="small"
          onClick={(e) => {
            e.stopPropagation(); // Evita propagação para elementos de trás
            onClose();
          }}
          icon="IoClose"
          tooltip="none"
          className="inline-flex items-center justify-center rounded-md h-10 w-10 text-accent-foreground hover:bg-accent hover:text-accent-foreground"
        />
      </div>

      {/* Card com os detalhes do feedback */}
      <Card className="h-full border-t-0 shadow-md">
        <CardHeader className="flex flex-col items-start justify-between">
          <CardTitle className="font-title text-accent-foreground text-lg mb-1">
            Conselho Publicado
          </CardTitle>
          <span className="text-sm text-muted-foreground mb-4">
            {periodo || "Período não informado"}
          </span>
        </CardHeader>

        <CardContent className="flex flex-col justify-between h-[calc(100%-7rem)] overflow-y-auto px-2 pb-4">
          {!feedback ? (
            // Caso não tenha feedback selecionado
            <div className="flex items-center justify-center h-full text-muted-foreground text-center px-2">
              Nenhum conselho selecionado!
            </div>
          ) : (
            <div className="flex flex-col gap-6 sm:gap-8 flex-1">
              {/* Pontos Fortes */}
              <div className="flex flex-col flex-1">
                <Label className="mb-2 text-base font-semibold">Pontos Fortes</Label>
                <Textarea
                  value={feedback.pontosFortes}
                  readOnly
                  className="resize-none min-h-[150px] sm:min-h-[170px] text-sm leading-relaxed"
                />
              </div>

              {/* Oportunidades de Melhoria */}
              <div className="flex flex-col flex-1">
                <Label className="mb-2 text-base font-semibold">
                  Oportunidades de Melhoria
                </Label>
                <Textarea
                  value={feedback.oportunidades}
                  readOnly
                  className="resize-none min-h-[150px] sm:min-h-[170px] text-sm leading-relaxed"
                />
              </div>

              {/* Sugestões */}
              <div className="flex flex-col flex-1">
                <Label className="mb-2 text-base font-semibold">Sugestões</Label>
                <Textarea
                  value={feedback.sugestoes}
                  readOnly
                  className="resize-none min-h-[150px] sm:min-h-[170px] text-sm leading-relaxed"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}

// ------------------ COMPONENTE PRINCIPAL: AlunoHome ------------------
export default function AlunoHome() {
  const [selectedConselho, setSelectedConselho] = useState<number | null>(null);
  const [filtro, setFiltro] = useState(""); // Filtro por texto
  const [ordenacao, setOrdenacao] = useState<"recente" | "antigo">("recente");
  const [anoFiltro, setAnoFiltro] = useState<string>(""); // Filtro por ano

  // ------------------ FILTRAGEM E ORDENAÇÃO ------------------
  let conselhosFiltrados = conselhos.filter((c) =>
    c.periodo.toLowerCase().includes(filtro.toLowerCase())
  );

  if (anoFiltro) {
    conselhosFiltrados = conselhosFiltrados.filter((c) =>
      c.periodo.includes(anoFiltro)
    );
  }

  // Ordena por ano (recente ou antigo)
  conselhosFiltrados.sort((a, b) => {
    const anoA = parseInt(a.periodo.split("/")[1]);
    const anoB = parseInt(b.periodo.split("/")[1]);
    return ordenacao === "recente" ? anoB - anoA : anoA - anoB;
  });

  const conselhoSelecionado = conselhos.find((c) => c.id === selectedConselho);

  return (
    <div className="flex flex-col lg:flex-row h-screen pt-24">
      {/* ------------------ LISTA DE CONSELHOS ------------------ */}
      <div className="flex-1 p-8">
        {/* Título e filtro */}
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-semibold text-primary">
            Meus Conselhos
          </h1>

          {/* Dropdown de filtros */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "flex items-center justify-center w-9 h-9 p-0 bg-primary hover:opacity-90 transition-colors",
                  (ordenacao || anoFiltro) && "bg-primary"
                )}
              >
                <FaFilter className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 p-0">
              <FiltrosPesquisa
                onSortChange={(valor) => setOrdenacao(valor)}
                onYearChange={(ano) => setAnoFiltro(ano)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* GRID DE CONSELHOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conselhosFiltrados.length > 0 ? (
            conselhosFiltrados.map((c) => (
              <MedModal
                key={c.id}
                courseCode={c.periodo}
                courseName="Conselho"
                onClick={() => setSelectedConselho(c.id)}
                className={cn(
                  "transition-transform hover:scale-[1.02] cursor-pointer",
                  selectedConselho === c.id && "ring-2 ring-primary scale-[1.02]"
                )}
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

      {/* ------------------ PAINEL LATERAL ------------------ */}
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
