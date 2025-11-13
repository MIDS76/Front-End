"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogLateral from "@/components/sidebar/logLateral";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";

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
      const timer = setTimeout(() => setShowLimitMsg(false), 3000);
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
      toast.error("Limite de dois representantes atingido.");
    }
  }

  function handleRemover(idOuNome: string) {
    setSelecionados((prev) =>
      prev.filter(
        (s) =>
          s.id?.toString() !== idOuNome &&
          s.nome !== idOuNome
      )
    );
  }

  // 🔹 Validação de erro padronizada antes de ir pra próxima tela
  function handleProximo() {
    if (selecionados.length === 0) {
      toast.error("Selecione dois representantes antes de prosseguir.");
      return;
    }
    if (selecionados.length < 2) {
      toast.error("É necessário selecionar dois representantes.");
      return;
    }
    router.push("/criar/conselho/finalizar");
  }

  const alunosFiltrados = alunosAtivos.filter((a) =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 px-[3rem] pt-[2rem] pb-[3rem] mt-[5rem]">
        <div className="max-w-[80rem] mx-auto flex flex-col items-center">
          {/* CABEÇALHO */}
          <div className="bg-[hsl(var(--card))] rounded-xl shadow-md p-[1.5rem] mb-[2rem] border border-[hsl(var(--border))] w-[48.4rem]">
            <h1 className="text-2xl font-semibold text-[hsl(var(--secondary))]">
              Conselho da turma MI 74
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-[0.25rem] mb-[0.5rem]">
              05/2024 até 09/2024
            </p>
            <div className="border-t border-[hsl(var(--border))] pt-[0.75rem]">
              <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">
                Selecione os Representantes de turma
              </h2>
            </div>
          </div>

          {/* LISTA */}
          <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-[48.4rem] h-[30rem] p-[1.25rem] flex flex-col">
            {/* Campo de busca */}
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

            {/* Lista de alunos */}
            <div className="flex-1 overflow-y-auto pr-[0.25rem]">
              <div className="grid gap-[0.5rem]">
                {alunosFiltrados.length > 0 ? (
                  alunosFiltrados.map((aluno) => (
                    <div
                      key={aluno.id}
                      className={`flex items-center justify-between border border-[hsl(var(--border))] rounded-md px-[1rem] py-[0.5rem] transition-colors ${selecionados.some((s) => s.id === aluno.id) ? "bg-[hsl(var(--muted))] border-[hsl(var(--primary))]" : "hover:bg-[hsl(var(--muted))]" }`}
                    >
                      <div className="flex items-center gap-[0.75rem]">
                        <Avatar className="h-[2rem] w-[2rem]">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(aluno.nome)}`}
                            alt={aluno.nome}
                          />
                          <AvatarFallback>
                            {aluno.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col text-sm">
                          <span className={`font-medium ${selecionados.some((s) => s.id === aluno.id) ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]"}`}>
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

          {/* Botão Anterior alinhado abaixo da lista */}
          <div className="w-[48.4rem] flex justify-start mt-[1rem]">
            <ButtonTT
              mode="default"
              onClick={() => router.push("/criar/conselho")}
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] px-[1.25rem] py-[0.5rem] rounded-md text-sm font-medium shadow-md transition-all"
            >
              Anterior
            </ButtonTT>
          </div>
        </div>
      </main>

      {/* Log lateral */}
      <LogLateral
        titulo="Representante"
        itens={selecionados.map((s) => ({
          id: s.id,
          unidade: s.nome,
          professor: s.email,
        }))}
        onRemover={handleRemover}
        vazioTexto="Nenhum representante selecionado"
        onProximo={handleProximo}
      />
    </div>
  );
}
