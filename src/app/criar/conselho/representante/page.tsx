"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RepresentantePage() {
  const router = useRouter();

  const lista = [
    { id: 1, nome: "Raquel", email: "raquel@gmail.com", role: "Aluno", isActive: true },
    { id: 2, nome: "Juscelino", email: "juscelino@gmail.com", role: "Professor", isActive: true },
    { id: 3, nome: "Isabeli", email: "isabeli@gmail.com", role: "Aluno", isActive: true },
    { id: 4, nome: "Julia Macena", email: "julia_macena@gmail.com", role: "Aluno", isActive: true },
    { id: 5, nome: "Geovanna", email: "geovanna@gmail.com", role: "Professor", isActive: true },
    { id: 6, nome: "Julia Gabrieli", email: "julia_gabrieli@gmail.com", role: "Aluno", isActive: true },
  ];

  const alunos = lista.filter((p) => p.role === "Aluno");
  const [selecionados, setSelecionados] = useState<typeof alunos>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  function toggleSelecionado(aluno: any) {
    const jaSelecionado = selecionados.some((s) => s.id === aluno.id);

    if (jaSelecionado) {
      setSelecionados((prev) => prev.filter((s) => s.id !== aluno.id));
    } else if (selecionados.length < 2) {
      setSelecionados((prev) => [...prev, aluno]);
    } else {
      setShowLimitMessage(true);
      setTimeout(() => setShowLimitMessage(false), 2500);
    }
  }

  function handleSalvar() {
    if (selecionados.length === 0) return;
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  }

  function handleRemover(id: number) {
    setSelecionados((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 px-12 pt-8 pb-12 mt-20">
        <div className="max-w-5xl mx-auto relative">
          {/* Card de título */}
          <div className="bg-[hsl(var(--card))] rounded-xl shadow-md p-6 mb-8 border border-[hsl(var(--border))] w-[775px] mx-auto">
            <h1 className="text-2xl font-semibold text-[hsl(var(--secondary))]">
              Seleção de Representantes da Turma
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Escolha até 2 alunos ativos para representarem a turma.
            </p>
            <div className="border-t border-[hsl(var(--border))] mt-4 pt-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">
                Alunos disponíveis
              </h2>
              <span className="text-sm text-[hsl(var(--muted-foreground))] font-medium">
                Selecionados:{" "}
                <span
                  className={`font-semibold ${
                    selecionados.length === 2
                      ? "text-[hsl(var(--destructive))]"
                      : "text-[hsl(var(--primary))]"
                  }`}
                >
                  {selecionados.length}/2
                </span>
              </span>
            </div>
          </div>

          {/* Lista de alunos */}
          <div className="flex justify-center gap-14 mt-6">
            <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-[760px] h-[480px] p-5 flex flex-col relative">
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid gap-3">
                  {alunos.map((aluno) => (
                    <label
                      key={aluno.id}
                      className={`flex items-center justify-between text-sm px-2 py-1 rounded-md ${
                        selecionados.some((s) => s.id === aluno.id)
                          ? "bg-[hsl(var(--accent))]/20 text-[hsl(var(--primary))] font-semibold"
                          : "text-[hsl(var(--foreground))]"
                      } ${
                        !aluno.isActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selecionados.some((s) => s.id === aluno.id)}
                          onChange={() => aluno.isActive && toggleSelecionado(aluno)}
                          className="w-4 h-4 accent-[hsl(var(--primary))]"
                          disabled={!aluno.isActive}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{aluno.nome}</span>
                          <span className="text-[hsl(var(--muted-foreground))] text-xs">
                            {aluno.email}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem de limite */}
          {showLimitMessage && (
            <div className="text-[hsl(var(--destructive))] text-sm mt-3 ml-[115px] font-medium">
              Você só pode selecionar no máximo 2 representantes.
            </div>
          )}

          {/* Botão salvar */}
          <div className="flex justify-end mt-6 w-[775px] mx-auto">
            <div className="flex items-center gap-3">
              {showMessage && (
                <span className="text-[hsl(var(--primary))] text-sm font-medium">
                  Representantes salvos!
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

      {/* Lateral - Representantes selecionados */}
      <aside className="relative w-[400px] flex-shrink-0 mt-20 flex flex-col rounded-l-xl overflow-hidden shadow-md">
        <div className="bg-[hsl(var(--primary))] p-4">
          <div className="text-[hsl(var(--primary-foreground))] font-semibold flex justify-between items-center mb-1 px-1">
            <span>Representantes</span>
          </div>
        </div>

        <div className="flex-1 bg-[hsl(var(--muted))] p-4 flex flex-col relative overflow-y-auto">
          <div className="flex flex-col gap-3 mb-24 pr-2">
            {selecionados.length === 0 ? (
              <div className="text-[hsl(var(--muted-foreground))] text-sm mt-8 px-2">
                Nenhum representante selecionado
              </div>
            ) : (
              selecionados.map((s) => (
                <div
                  key={s.id}
                  className="bg-[hsl(var(--card))] rounded-md px-3 py-2 shadow-sm flex justify-between items-center border border-[hsl(var(--border))]"
                >
                  <div className="text-sm text-[hsl(var(--foreground))] truncate">
                    <div className="font-medium">{s.nome}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                      {s.email}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemover(s.id)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Botão próximo */}
          <div className="absolute bottom-6 right-6">
            <button
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-base px-7 py-3 rounded-md shadow-md font-medium hover:bg-[hsl(var(--secondary))]"
              onClick={() => router.push("/criar/conselho/final")}
            >
              Próximo passo
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
