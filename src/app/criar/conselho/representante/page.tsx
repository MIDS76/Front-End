"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConselhoRepresentantePage() {
  const router = useRouter();

  const [turmas, setTurmas] = useState<string[]>([
    "MI 71",
    "MI 72",
    "MI 73",
    "MI 74",
    "MI 75",
    "MI 76",
  ]);

  const [representantes, setRepresentantes] = useState<string[]>([
    "João Pedro Lima",
    "Ana Beatriz Souza",
    "Carlos Henrique Silva",
    "Larissa Almeida",
    "Gabriel Santos",
    "Marina Oliveira",
    "Felipe Costa",
    "Julia Nunes",
  ]);

  const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]);
  const [selectedRepresentante, setSelectedRepresentante] = useState<string | null>(null);
  const [salvos, setSalvos] = useState<{ turma: string; representante: string }[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  const isTurmaDisabled = (t: string) => salvos.some((s) => s.turma === t);

  function toggleTurma(t: string) {
    if (isTurmaDisabled(t)) return;
    setSelectedTurmas((prev) =>
      prev.includes(t) ? prev.filter((p) => p !== t) : [...prev, t]
    );
  }

  function handleSalvar() {
    if (selectedTurmas.length === 0 || !selectedRepresentante) return;

    const novos = selectedTurmas.map((t) => ({
      turma: t,
      representante: selectedRepresentante!,
    }));

    const novosFiltrados = novos.filter(
      (n) => !salvos.some((s) => s.turma === n.turma)
    );

    setSalvos((prev) => [...prev, ...novosFiltrados]);
    setSelectedTurmas([]);
    setSelectedRepresentante(null);

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  }

  function handleRemover(turma: string) {
    setSalvos((prev) => prev.filter((s) => s.turma !== turma));
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 px-12 pt-8 pb-12 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Card de título */}
          <div className="bg-[hsl(var(--card))] rounded-xl shadow-md p-6 mb-8 border border-[hsl(var(--border))] w-[775px] mx-auto">
            <h1 className="text-2xl font-semibold text-[hsl(var(--secondary))]">
              Representantes de Turma
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Selecione os representantes de cada turma
            </p>
            <div className="border-t border-[hsl(var(--border))] mt-4 pt-4">
              <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">
                Associação entre turma e representante
              </h2>
            </div>
          </div>

          {/* Cards centrais */}
          <div className="flex justify-center gap-14 mt-6">
            {/* Card Turmas */}
            <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-[360px] h-[480px] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[hsl(var(--secondary))]">
                  Selecione as turmas
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid gap-2">
                  {turmas.map((t) => (
                    <label
                      key={t}
                      className={`flex items-center gap-3 text-sm ${
                        isTurmaDisabled(t)
                          ? "text-[hsl(var(--muted-foreground))] line-through select-none"
                          : "text-[hsl(var(--foreground))]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTurmas.includes(t)}
                        onChange={() => toggleTurma(t)}
                        disabled={isTurmaDisabled(t)}
                        className="w-4 h-4 accent-[hsl(var(--primary))]"
                      />
                      <span className="truncate">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Representantes */}
            <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-[360px] h-[480px] p-5 flex flex-col">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[hsl(var(--secondary))]">
                  Selecione os representantes
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid gap-2">
                  {representantes.map((rep) => (
                    <label
                      key={rep}
                      className="flex items-center gap-3 text-sm cursor-pointer text-[hsl(var(--foreground))]"
                    >
                      <input
                        type="radio"
                        name="representante"
                        value={rep}
                        checked={selectedRepresentante === rep}
                        onChange={() => setSelectedRepresentante(rep)}
                        className="w-4 h-4 accent-[hsl(var(--primary))]"
                      />
                      <span className="truncate">{rep}</span>
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
                <span className="text-[hsl(var(--primary))] text-sm font-medium">
                  Representante salvo com sucesso!
                </span>
              )}

              <button
                onClick={handleSalvar}
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] px-6 py-2 rounded-md text-sm font-medium shadow-md"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Log lateral */}
      <aside className="relative w-[400px] flex-shrink-0 mt-20 flex flex-col rounded-l-xl overflow-hidden shadow-md">
        {/* Cabeçalho */}
        <div className="bg-[hsl(var(--primary))] p-4">
          <div className="text-[hsl(var(--primary-foreground))] font-semibold flex justify-between items-center mb-1 px-1">
            <span>Turma</span>
            <span className="text-sm">Representante</span>
          </div>
        </div>

        {/* Corpo */}
        <div className="flex-1 bg-[hsl(var(--muted))] p-4 flex flex-col relative overflow-y-auto">
          <div className="flex flex-col gap-3 mb-24 pr-2">
            {salvos.length === 0 ? (
              <div className="text-[hsl(var(--muted-foreground))] text-sm mt-8 px-2">
                Nenhum representante salvo ainda
              </div>
            ) : (
              salvos.map((s, i) => (
                <div
                  key={i}
                  className="bg-[hsl(var(--card))] rounded-md px-3 py-2 shadow-sm flex justify-between items-center border border-[hsl(var(--border))]"
                >
                  <div className="text-sm text-[hsl(var(--foreground))] w-1/2 truncate">
                    {s.turma}
                  </div>
                  <div className="flex items-center justify-end gap-2 w-1/2 truncate">
                    <span className="text-sm font-medium text-[hsl(var(--secondary))] truncate">
                      {s.representante}
                    </span>
                    <button
                      onClick={() => handleRemover(s.turma)}
                      className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] text-sm font-bold"
                      title="Remover"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Botão final (visual apenas, sem redirecionar) */}
          <div className="absolute bottom-6 right-6">
            <button
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-base px-7 py-3 rounded-md shadow-md font-medium hover:bg-[hsl(var(--secondary))]"
            >
              Concluir
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
