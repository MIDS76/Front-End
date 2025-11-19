import React from "react";

// Tipagem para o objeto de conselho
interface Conselho {
  id: number;
  aluno: string;
  data: string;
  status: string;
  feedback: string;
}

// Tipagem dos props do FeedbackModal
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  conselho: Conselho | null; // Pode ser null caso o conselho não seja selecionado
}

export function FeedbackModal({ isOpen, onClose, conselho }: FeedbackModalProps) {
  if (!isOpen || !conselho) return null; // Verifica se o modal está aberto e se o conselho existe

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Detalhes do Conselho</h3>
        <p><strong>Data:</strong> {new Date(conselho.data).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {conselho.status}</p>
        <p><strong>Feedback:</strong> {conselho.feedback}</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
