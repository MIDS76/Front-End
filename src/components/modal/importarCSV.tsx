"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

interface ImportarCSVProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onImported?: () => void;
  width?: string;  // largura opcional
  height?: string; // altura opcional
}

export default function ImportarCSV({ isOpen, setOpen, onImported, width, height }: ImportarCSVProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      setError(null);
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
    setArquivo(null);

    if (onImported) onImported();
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLLabelElement;
    target.classList.add("border-teal-500");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLLabelElement;
    target.classList.remove("border-teal-500");
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      setArquivo(file);
      setError(null);
    } else {
      setError("Por favor, arraste um arquivo CSV válido.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Área de Drag & Drop */}
      <label
        htmlFor="arquivo"
        className="block border-2 border-dashed border-gray-400 rounded-lg cursor-pointer"
        style={{ width: width || "24rem", height: height || "18rem" }} 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
          <span className="text-7xl mb-4 leading-none" style={{ color: "#93a7b0" }}>+</span>
          <span className="text-base leading-relaxed max-w-xs">
            Arraste os arquivos CSV para importar os dados.
          </span>
        </div>
      </label>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Botões */}
      <div className="flex justify-center gap-5">
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
  );
}
