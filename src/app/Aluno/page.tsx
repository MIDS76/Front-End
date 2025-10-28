"use client";

import React, { useState } from "react";
import MedModal from "@/components/modal/medModal";
import FeedbackPanel from "@/components/FeedbackPanel";
import { Input } from "@/components/ui/input"; // 👈 importa o input estilizado

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

export default function AlunoHome() {
  const [selectedConselho, setSelectedConselho] = useState<number | null>(null);
  const [filtro, setFiltro] = useState("");

  const conselhoSelecionado = conselhos.find((c) => c.id === selectedConselho);

  // filtra os conselhos com base no texto digitado
  const conselhosFiltrados = conselhos.filter((c) =>
    c.periodo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Coluna da esquerda */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4 text-primary">
          Meus Conselhos
        </h1>

        {/* Input de pesquisa */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Pesquisar conselho por período..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="max-w-sm bg-white shadow-sm"
          />
        </div>

        {/* Grid de conselhos */}
        <div className="grid grid-cols-3 gap-4">
          {conselhosFiltrados.map((c) => (
            <MedModal
              key={c.id}
              courseCode={c.periodo}
              courseName="Conselho" 
              onClick={() => setSelectedConselho(c.id)}
              className={`transition-transform hover:scale-[1.02] ${
                selectedConselho === c.id
                  ? "ring-2 ring-primary scale-[1.02]"
                  : ""
              }`}
            >
              <p className="text-muted-foreground text-right">
                <span className="font-semibold">Status:</span> {c.status}
              </p>
            </MedModal>
          ))}

          {/* Caso não encontre nenhum */}
          {conselhosFiltrados.length === 0 && (
            <p className="text-muted-foreground col-span-3 text-center mt-6">
              Nenhum conselho encontrado!
            </p>
          )}
        </div>
      </div>

      {/* Coluna da direita */}
      <div className="w-[30%] p-6">
        <FeedbackPanel
          feedback={conselhoSelecionado?.feedback ?? null}
          periodo={conselhoSelecionado?.periodo}
        />
      </div>
    </div>
  );
}
