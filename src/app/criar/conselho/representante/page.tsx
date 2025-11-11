"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function RepresentantePage() {
  const router = useRouter();

  const lista = [
    { id: 1, nome: "Raquel Silva", email: "raquel@gmail.com", role: "Aluno", isActive: true },
    { id: 2, nome: "Juscelino Brandão", email: "juscelino_brandao@gmail.com", role: "Aluno", isActive: true },
    { id: 3, nome: "Isabeli Ferreira", email: "isabeli_ferreira@gmail.com", role: "Aluno", isActive: true },
    { id: 4, nome: "Julia Macena", email: "julia_macena@gmail.com", role: "Aluno", isActive: true },
    { id: 5, nome: "Geovanna", email: "geovanna@gmail.com", role: "Aluno", isActive: true },
    { id: 6, nome: "Henrique Menel", email: "henrique_menel@gmail.com", role: "Aluno", isActive: true },
    { id: 7, nome: "Julia Gabrieli", email: "julia_gabrieli@gmail.com", role: "Aluno", isActive: true },
    { id: 8, nome: "Hellen Scarantti", email: "hellen_scarantti@gmail.com", role: "Aluno", isActive: true },
    { id: 9, nome: "Lavinia Domingos", email: "lavinia_domingos@gmail.com", role: "Aluno", isActive: true },
    { id: 10, nome: "Ariane Kedma", email: "ariane_kedma@gmail.com", role: "Aluno", isActive: true },
  ];

  const alunosAtivos = lista.filter((a) => a.role === "Aluno" && a.isActive);

  const [selecionados, setSelecionados] = useState<typeof alunosAtivos>([]);
  const [maxMessage, setMaxMessage] = useState(false);
  const [showLimitMsg, setShowLimitMsg] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // controle da mensagem de limite
  useEffect(() => {
    if (maxMessage) {
      setShowLimitMsg(true);
      const timer = setTimeout(() => {
        setShowLimitMsg(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [maxMessage]);

  function toggleSelecionado(aluno: any) {
    const jaSelecionado = selecionados.some((s) => s.id === aluno.id);

    if (jaSelecionado) {
      setSelecionados((prev) => prev.filter((s) => s.id !== aluno.id));
      setMaxMessage(false);
    } else if (selecionados.length < 2) {
      setSelecionados((prev) => [...prev, aluno]);
      setMaxMessage(false);
    } else {
      setMaxMessage(true);
    }
  }

  function handleRemover(id: number) {
    setSelecionados((prev) => prev.filter((s) => s.id !== id));
  }

  const alunosFiltrados = alunosAtivos.filter((a) =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 px-12 pt-8 pb-12 mt-20">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* CARD CENTRAL (INFORMATIVO) */}
          <div className="bg-[hsl(var(--card))] rounded-xl shadow-md p-6 border border-[hsl(var(--border))] w-[775px] text-center">
            <h1 className="text-2xl font-semibold text-[hsl(var(--secondary))]">
              Seleção de Representantes da Turma
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Escolha até 2 alunos ativos para representarem a turma.
            </p>
          </div>

          {/* CARD DE PESQUISA + LISTA */}
          <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-[775px] h-[480px] p-5 mt-6 flex flex-col">
            {/* Barra de busca */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-2.5 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Buscar Representante"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-md border-[hsl(var(--border))]
                           bg-[hsl(var(--background))] focus:outline-none focus:ring-1
                           focus:ring-[hsl(var(--primary))] placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid gap-2">
                {alunosFiltrados.length > 0 ? (
                  alunosFiltrados.map((aluno) => (
                    <div
                      key={aluno.id}
                      className={`flex items-center justify-between border border-[hsl(var(--border))] rounded-md px-4 py-2 transition-colors ${
                        selecionados.some((s) => s.id === aluno.id)
                          ? "bg-[hsl(var(--muted))] border-[hsl(var(--primary))]"
                          : "hover:bg-[hsl(var(--muted))]"
                      }`}
                    >
                      {/* Avatar + infos */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              aluno.nome
                            )}`}
                            alt={aluno.nome}
                          />
                          <AvatarFallback>
                            {aluno.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col text-sm">
                          <span
                            className={`font-medium ${
                              selecionados.some((s) => s.id === aluno.id)
                                ? "text-[hsl(var(--primary))]"
                                : "text-[hsl(var(--foreground))]"
                            }`}
                          >
                            {aluno.nome}
                          </span>
                          <span className="text-[hsl(var(--muted-foreground))] text-xs">
                            {aluno.email}
                          </span>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={selecionados.some((s) => s.id === aluno.id)}
                        onChange={() => toggleSelecionado(aluno)}
                        className="w-4 h-4 accent-[hsl(var(--primary))]"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mt-4">
                    Nenhum aluno encontrado.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* MENSAGEM DE LIMITE */}
          {showLimitMsg && (
            <p
              className={`text-sm text-[hsl(var(--destructive))] mt-3 text-right italic font-semibold transition-opacity duration-700 ${
                showLimitMsg ? "opacity-100" : "opacity-0"
              } w-[775px]`}
            >
             Limite de dois representantes atingido
            </p>
          )}
        </div>
      </main>

      {/* LOG lateral */}
      <aside className="relative w-[400px] flex-shrink-0 mt-20 flex flex-col rounded-l-xl overflow-hidden shadow-md">
        <div className="bg-[hsl(var(--primary))] p-4">
          <div className="text-[hsl(var(--primary-foreground))] font-semibold flex justify-between items-center mb-1 px-1">
            <span>Representantes</span>
            <span className="text-sm">{selecionados.length}/2</span>
          </div>
        </div>

        <div className="flex-1 bg-[hsl(var(--muted))] p-4 flex flex-col relative overflow-y-auto">
          <div className="flex flex-col gap-3 mb-24 pr-2">
            {selecionados.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[hsl(var(--muted-foreground))] text-sm italic">
                  Nenhum representante selecionado
                </p>
              </div>
            ) : (
              selecionados.map((s) => (
                <div
                  key={s.id}
                  className="bg-[hsl(var(--card))] rounded-md px-3 py-2 shadow-sm flex justify-between items-center border border-[hsl(var(--border))]"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          s.nome
                        )}`}
                        alt={s.nome}
                      />
                      <AvatarFallback>
                        {s.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm text-[hsl(var(--foreground))] truncate">{s.nome}</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                        {s.email}
                      </span>
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

          {/* Botão de próximo passo */}
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
