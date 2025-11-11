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
  const [showLimitMsg, setShowLimitMsg] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (showLimitMsg) {
      const timer = setTimeout(() => {
        setShowLimitMsg(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLimitMsg]);

  function toggleSelecionado(aluno: any) {
    const jaSelecionado = selecionados.some((s) => s.id === aluno.id);
    if (jaSelecionado) {
      setSelecionados((prev) => prev.filter((s) => s.id !== aluno.id));
    } else if (selecionados.length < 2) {
      setSelecionados((prev) => [...prev, aluno]);
    } else {
      setShowLimitMsg(true);
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
      <main className="flex-1 px-[3rem] pt-[2rem] pb-[3rem] mt-[5rem]">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* CARD CENTRAL */}
          <div className="bg-white rounded-lg shadow-md border border-[hsl(var(--border))] w-[48.4rem] text-left px-[1.5rem] py-[1rem]">
            <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
              Conselho da turma MI 74
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-[0.2rem]">
              05/2024 até 09/2024
            </p>
            <hr className="my-[0.5rem] border-[hsl(var(--border))]" />
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">
              Selecione os Representantes de turma
            </p>
          </div>

          {/* CARD DE PESQUISA + LISTA */}
          <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-[48.4rem] h-[30rem] p-[1.25rem] mt-[1.5rem] flex flex-col">
            {/* Barra de busca */}
            <div className="relative mb-[1rem]">
              <FiSearch className="absolute left-[0.75rem] top-[0.65rem] text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Buscar Representante"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-[2.25rem] pr-[0.75rem] py-[0.5rem] text-sm border rounded-md border-[hsl(var(--border))] 
                           bg-white focus:outline-none focus:ring-1 
                           focus:ring-[hsl(var(--primary))] placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto pr-[0.25rem]">
              <div className="grid gap-[0.5rem]">
                {alunosFiltrados.length > 0 ? (
                  alunosFiltrados.map((aluno) => (
                    <div
                      key={aluno.id}
                      className={`flex items-center justify-between border border-[hsl(var(--border))] rounded-md px-[1rem] py-[0.5rem] transition-colors ${
                        selecionados.some((s) => s.id === aluno.id)
                          ? "bg-[hsl(var(--muted))] border-[hsl(var(--primary))]"
                          : "hover:bg-[hsl(var(--muted))]"
                      }`}
                    >
                      <div className="flex items-center gap-[0.75rem]">
                        <Avatar className="h-[2rem] w-[2rem]">
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
                        className="w-[1rem] h-[1rem] accent-[hsl(var(--primary))]"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mt-[1rem]">
                    Nenhum aluno encontrado.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* MENSAGEM DE LIMITE */}
          {showLimitMsg && (
            <p
              className="text-sm text-[hsl(var(--destructive))] mt-[1rem] text-right italic font-semibold transition-opacity duration-700 w-[48.4rem]"
            >
              Limite de dois representantes atingido
            </p>
          )}
        </div>
      </main>

      {/* LOG lateral */}
      <aside className="relative w-[25rem] flex-shrink-0 mt-[5rem] flex flex-col rounded-l-xl overflow-hidden shadow-md">
        <div className="bg-[hsl(var(--primary))] p-[1rem]">
          <div className="text-[hsl(var(--primary-foreground))] font-semibold flex justify-between items-center mb-[0.25rem] px-[0.25rem]">
            <span>Representantes</span>
            <span className="text-sm">{selecionados.length}/2</span>
          </div>
        </div>

        <div className="flex-1 bg-[hsl(var(--muted))] p-[1rem] flex flex-col relative overflow-y-auto">
          <div className="flex flex-col gap-[0.75rem] mb-[6rem] pr-[0.5rem]">
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
                  className="bg-[hsl(var(--card))] rounded-md px-[0.75rem] py-[0.5rem] shadow-sm flex justify-between items-center border border-[hsl(var(--border))]"
                >
                  <div className="flex items-center gap-[0.5rem]">
                    <Avatar className="h-[1.5rem] w-[1.5rem]">
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

          <div className="absolute bottom-[1.5rem] right-[1.5rem]">
            <button
              className="flex items-center gap-[0.5rem] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] text-sm px-[1.25rem] py-[0.5rem] rounded-md font-medium shadow-md transition-all"
              onClick={() => router.push('')}
            >
              Próximo passo <span className="text-base font-semibold">›</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
