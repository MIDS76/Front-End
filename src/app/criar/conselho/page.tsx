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

  useEffect(() => {}, []);

  return (
    <div className="flex min-h-screen bg-[#f5f6f5]">
      {/* Conteúdo principal */}
      <main className="flex-1 px-12 pt-8 pb-12 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Card topo */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border">
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

          {/* Área dos dois cards */}
          <div className="flex justify-center gap-14 mt-6"> {/* 👈 só afasta os dois cards */}
            {/* Card Unidades */}
            <div className="bg-white rounded-xl border shadow-sm w-[360px] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#113f3d]">
                  Selecione as unidades curriculares
                </h3>
              </div>

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

            {/* Card Professores */}
            <div className="bg-white rounded-xl border shadow-sm w-[360px] p-5 flex flex-col justify-between">
              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-[#113f3d]">
                    Selecione os professores
                  </h3>
                </div>

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

              <div className="flex items-center justify-end mt-4">
                <div className="flex flex-col items-end">
                  <ButtonTT mode="default" onClick={handleSalvar}>
                    Salvar
                  </ButtonTT>

                  {showMessage && (
                    <span className="text-green-600 text-xs mt-2">
                      Unidade salva com sucesso!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Log lateral fixo à direita */}
      <aside className="relative w-[320px] bg-[#7EA5A2] p-4 pt-6 flex-shrink-0 mt-20 flex flex-col">
        <div className="text-white font-semibold flex justify-between items-center mb-3 px-2">
          <span>Unidade Curricular</span>
          <span className="text-sm">Professor</span>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto mb-20 pr-2">
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
                <div className="text-sm font-medium text-gray-800 w-1/2 text-right truncate">
                  {s.professor}
                </div>
              </div>
            ))
          )}
        </div>

        {/* botão fixo no rodapé */}
        <div className="absolute bottom-4 right-4">
          <button
            className="bg-[#0f5653] text-white text-sm px-4 py-2 rounded-md shadow-md"
            onClick={() => console.log("Próximo passo")}
          >
            Próximo passo
          </button>
        </div>
      </aside>
    </div>
  );
}
