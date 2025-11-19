"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

interface ImportarCSVProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalFecharAfora({
  isOpen,
  setOpen,
}: ImportarCSVProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);

  // Função de manipulação de arquivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      setError(null);  // Limpa o erro se o arquivo for escolhido
    }
  };

  const handleChooseFileClick = () => {
    inputFileRef.current?.click();
  };

  const handleImport = () => {
    if (!arquivo) {
      setError("Por favor, escolha um arquivo CSV.");
      return;
    }

    toast.success("Arquivo importado com sucesso!");
    setArquivo(null); // Limpa o arquivo após a importação
  };

  // Função para fechar o modal ao clicar fora
  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div className="bg-white rounded-2xl p-8 w-[36rem] max-w-full shadow-md">
        <h2 className="text-center font-semibold text-gray-800 mb-8 text-lg">
          Importar Unidades Curriculares
        </h2>

        {/* Área de arrastar ou escolher arquivo */}
        <label
          htmlFor="arquivo"
          className="block border-2 border-dashed border-gray-400 rounded-lg cursor-pointer mx-auto"
          style={{ width: "24rem", height: "18rem" }}
        >
          <input
            type="file"
            accept=".csv"
            id="arquivo"
            className="hidden"
            onChange={handleFileChange}
            ref={inputFileRef}
          />
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-6">
            <span
              className="text-7xl mb-4 leading-none"
              style={{ color: "#93a7b0" }}
            >
              +
            </span>
            <span className="text-base leading-relaxed max-w-xs">
              Arraste os arquivos CSV com a lista de Unidades Curriculares para importar os dados.
            </span>
          </div>
        </label>

        {/* Exibe erro se não houver arquivo selecionado */}
        {error && <p className="text-red-500 text-center mt-3">{error}</p>}

        {/* Botões */}
        <div className="flex justify-center gap-5 mt-8">
          <button
            onClick={handleChooseFileClick}
            className="rounded border border-gray-400 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Escolher Ficheiro
          </button>

          <button
            onClick={handleImport}
            className="rounded bg-teal-700 px-5 py-2 text-sm text-white hover:bg-teal-600"
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  );
}
