"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import Papa from 'papaparse';

interface ImportarCSVProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onImported?: (data: any[]) => void;
  width?: string;  // largura opcional
  height?: string; // altura opcional
}

export default function ImportarCSV({ isOpen, setOpen, onImported, width, height }: ImportarCSVProps) {
  const [arquivo, setArquivo] = useState<any[] | null>([]);
  const [error, setError] = useState<string | null>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;

          // Verifique se data é um array e se o primeiro item é um objeto
          if (Array.isArray(data) && data.length > 0 && data[0] !== null && typeof data[0] === "object") {
            const keys = Object.keys(data[0]);  // Acesse as chaves do primeiro objeto (cabeçalho do CSV)	

            // Verificação para Unidade Curricular (uma coluna 'nome')
            if (keys.length === 1 && keys[0] === "nome") {
              setArquivo(data);  // Atualiza o estado com a lista de unidades curriculares
              setError(null);     // Reseta o erro
            }

            // Verificação para Lista de Alunos (3 colunas: 'nome', 'email', 'matricula')
            else if (keys.length === 3 && keys.includes("nome") && keys.includes("email") && keys.includes("matricula")) {
              setArquivo(data);  // Atualiza o estado com a lista de alunos
              setError(null);     // Reseta o erro
            } else {
              setError("Arquivo inválido.");
            }
          } else {
            setError("Arquivo vazio ou inválido.");
          }
        },
        error: () => {
          setError("Erro ao ler o arquivo CSV.");
        }
      });
    }
  };



  const handleChooseFileClick = () => {
    inputFileRef.current?.click();
  };

  const handleImport = () => {
    if (!arquivo || arquivo.length === 0) {
      setError("Por favor, escolha um arquivo CSV.");
      return;
    }

    toast.success("Arquivo importado com sucesso!");
    onImported?.(arquivo);
    setOpen(false);
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
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setArquivo(result.data);
          setError(null);
        },
        error: (err) => {
          setError("Erro ao ler o arquivo CSV.");
          toast.error("Erro ao ler o arquivo CSV");
        }
      })
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
            Arraste os arquivos CSV com a lista de Unidades Curriculares para importar os dados.
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
