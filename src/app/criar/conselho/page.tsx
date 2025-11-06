"use client";

import { useEffect, useState } from "react";
import ButtonTT from "@/components/button/ButtonTT";

export default function ConselhoPage() {
  const [unidades, setUnidades] = useState<string[]>([
    "Arquitetura de Redes",
    "Desenvolvimento Mobile",
    "Banco de Dados",
    "Programação de API",
    "Automação Industrial",
    "Processos e Produtos WEG",
    "Matemática Aplicada",
    "Engenharia de Software",
    "Segurança da Informação",
    "Sistemas Embarcados",
    "Redes de Computadores",
    "Análise de Sistemas",
    "Computação em Nuvem",
    "Internet das Coisas",
    "Gestão de Projetos",
    "Sistemas Distribuídos",
  ]);

  const [professores, setProfessores] = useState<string[]>([
    "Roberto Baumgartel",
    "Matheus Quost",
    "João Pedro Valentim",
    "Romário Hornburg",
    "André Kessler",
    "Gabriela Silva",
    "Renan Souza",
    "Paula Schmidt",
    "Marcos Hoffmann",
    "Juliana Andrade",
    "Felipe Borges",
    "Larissa Pereira",
    "César Lima",
    "Bianca Moura",
    "Eduardo Klein",
  ]);

  const [selectedUnidades, setSelectedUnidades] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);
  const [salvos, setSalvos] = useState<{ unidade: string; professor: string }[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  const isUcDisabled = (uc: string) => salvos.some((s) => s.unidade === uc);

  function toggleUnidade(uc: string) {
    if (isUcDisabled(uc)) return;
    setSelectedUnidades((prev) =>
      prev.includes(uc) ? prev.filter((p) => p !== uc) : [...prev, uc]
    );
  }

  function handleSalvar() {
    if (selectedUnidades.length === 0 || !selectedProfessor) return;

    const novos = selectedUnidades.map((u) => ({
      unidade: u,
      professor: selectedProfessor!,
    }));

    const novosFiltrados = novos.filter(
      (n) => !salvos.some((s) => s.unidade === n.unidade)
    );

    setSalvos((prev) => [...prev, ...novosFiltrados]);
    setSelectedUnidades([]);
    setSelectedProfessor(null);

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  }

  function handleRemover(unidade: string) {
    setSalvos((prev) => prev.filter((s) => s.unidade !== unidade));
  }

  useEffect(() => {}, []);

  return (
    <div className="flex min-h-screen bg-[#f5f6f5]">
      <main className="flex-1 px-12 pt-8 pb-12 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Card de título */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border w-[775px] mx-auto">
            <h1 className="text-2xl font-semibold text-[#113f3d]">
              Conselho da turma MI 74
            </h1>
            <p className="text-sm text-gray-500 mt-1">05/2024 até 09/2024</p>
            <div className="border-t mt-4 pt-4">
              <h2 className="text-lg font-medium text-gray-800">
                Selecione os Representantes de turma
              </h2>
            </div>
          </div>

          {/* Cards centrais */}
          <div className="flex justify-center gap-14 mt-6">
            {/* Card Unidades */}
            <div className="bg-white rounded-xl border shadow-sm w-[360px] h-[480px] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#113f3d]">
                  Selecione as unidades curriculares
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid gap-2">
                  {unidades.map((uc) => (
                    <label
                      key={uc}
                      className={`flex items-center gap-3 text-sm ${
                        isUcDisabled(uc)
                          ? "text-gray-400 line-through select-none"
                          : "text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUnidades.includes(uc)}
                        onChange={() => toggleUnidade(uc)}
                        disabled={isUcDisabled(uc)}
                        className="w-4 h-4 accent-[#113f3d]"
                      />
                      <span className="truncate">{uc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Professores */}
            <div className="bg-white rounded-xl border shadow-sm w-[360px] h-[480px] p-5 flex flex-col">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#113f3d]">
                  Selecione os professores
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid gap-2">
                  {professores.map((prof) => (
                    <label
                      key={prof}
                      className="flex items-center gap-3 text-sm cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="professor"
                        value={prof}
                        checked={selectedProfessor === prof}
                        onChange={() => setSelectedProfessor(prof)}
                        className="w-4 h-4 accent-[#113f3d]"
                      />
                      <span className="truncate text-gray-700">{prof}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botão Salvar + Mensagem lado a lado */}
          <div className="flex justify-end mt-4 w-[775px] mx-auto">
            <div className="flex items-center gap-3">
              {showMessage && (
                <span className="text-[#0f5653] text-sm font-medium">
                  Unidade salva com sucesso!
                </span>
              )}

              <button
                onClick={handleSalvar}
                className="bg-[#0f5653] hover:bg-[#0c4946] text-white px-6 py-2 rounded-md text-sm font-medium shadow-md"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Log lateral */}
      <aside className="relative w-[400px] flex-shrink-0 mt-20 flex flex-col rounded-l-xl overflow-hidden shadow-md">
        {/* Cabeçalho verde escuro */}
        <div className="bg-[#447F88] p-4">
          <div className="text-white font-semibold flex justify-between items-center mb-1 px-1">
            <span>Unidade Curricular</span>
            <span className="text-sm">Professor</span>
          </div>
        </div>

        {/* Corpo verde claro com scroll */}
        <div className="flex-1 bg-[#c9dcdf] p-4 flex flex-col relative overflow-y-auto">
          <div className="flex flex-col gap-3 mb-24 pr-2">
            {salvos.length === 0 ? (
              <div className="text-white/90 text-sm mt-8 px-2">
                Nenhuma unidade salva ainda
              </div>
            ) : (
              salvos.map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-md px-3 py-2 shadow-sm flex justify-between items-center"
                >
                  <div className="text-sm text-gray-700 w-1/2 truncate">
                    {s.unidade}
                  </div>
                  <div className="flex items-center justify-end gap-2 w-1/2 truncate">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {s.professor}
                    </span>
                    <button
                      onClick={() => handleRemover(s.unidade)}
                      className="text-gray-400 hover:text-red-600 text-sm font-bold"
                      title="Remover"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Botão fixo aumentado */}
          <div className="absolute bottom-6 right-6">
            <button
              className="bg-[#0f5653] text-white text-base px-7 py-3 rounded-md shadow-md font-medium hover:bg-[#0c4946]"
              onClick={() => console.log("Próximo passo")}
            >
              Próximo passo
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
