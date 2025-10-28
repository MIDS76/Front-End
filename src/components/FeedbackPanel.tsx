"use client";
import React from "react";

interface Feedback {
  pontosFortes: string;
  oportunidades: string;
  sugestoes: string;
}

interface FeedbackPanelProps {
  feedback: Feedback | null;
  periodo?: string;
}

export default function FeedbackPanel({ feedback, periodo }: FeedbackPanelProps) {
  if (!feedback) {
    return (
      <div className="bg-[#d9e3e6] rounded-lg p-6 w-full h-full flex items-center justify-center text-gray-700">
        <p>Selecione um conselho disponível para acesso</p>
      </div>
    );
  }

  return (
    <div className="bg-[#d9e3e6] rounded-lg p-6 w-full text-gray-800">
      <h3 className="text-lg font-semibold mb-2">Conselho Publicado</h3>
      <p className="text-sm mb-4">{periodo}</p>

      <div className="flex flex-col gap-4">
        <div>
          <p className="font-semibold">Pontos Fortes</p>
          <textarea
            readOnly
            className="w-full mt-1 p-2 rounded border bg-white"
            value={feedback.pontosFortes}
          />
        </div>
        <div>
          <p className="font-semibold">Oportunidades de Melhoria</p>
          <textarea
            readOnly
            className="w-full mt-1 p-2 rounded border bg-white"
            value={feedback.oportunidades}
          />
        </div>
        <div>
          <p className="font-semibold">Sugestões</p>
          <textarea
            readOnly
            className="w-full mt-1 p-2 rounded border bg-white"
            value={feedback.sugestoes}
          />
        </div>
      </div>
    </div>
  );
}
 