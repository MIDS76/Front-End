"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import LogLateral from "@/components/sidebar/logLateral";

export default function ConselhoPage() {
  const router = useRouter();

  const [unidades] = useState<string[]>([
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
    "Gestão de Projetos",
    "Sistemas Distribuídos",
  ]);

  const [professores] = useState<string[]>([
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
  const [buscaProfessor, setBuscaProfessor] = useState("");
  const [buscaUnidade, setBuscaUnidade] = useState("");

  const normalizar = (texto: string) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const unidadesFiltradas = unidades.filter((u) =>
    normalizar(u).includes(normalizar(buscaUnidade))
  );
  const professoresFiltrados = professores.filter((p) =>
    normalizar(p).includes(normalizar(buscaProfessor))
  );

  function toggleUnidade(uc: string) {
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

    //Ucs salvas e limpar
    setSalvos((prev) => [...prev, ...novos]);

   
    setSelectedUnidades([]);
    setSelectedProfessor(null);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  }

  function handleRemover(unidade: string) {
    setSalvos((prev) => prev.filter((s) => s.unidade !== unidade));
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 px-[3rem] pt-[2rem] pb-[3rem] mt-[5rem]">
        <div className="max-w-[80rem] mx-auto">
          {/* Cabeçalho */}
          <div className="bg-[hsl(var(--card))] rounded-xl shadow-md p-[1.5rem] mb-[2rem] border border-[hsl(var(--border))] w-[48.4rem] mx-auto">
            <h1 className="text-2xl font-semibold text-[hsl(var(--secondary))]">
              Conselho da turma MI 74
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-[0.25rem] mb-[0.5rem]">
              05/2025 até 09/2025
            </p>
            <div className="border-t border-[hsl(var(--border))] pt-[0.75rem]">
              <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">
                Selecione os Professores de cada unidade curricular
              </h2>
            </div>
          </div>

          {/* Cards centrais */}
          <div className="flex justify-center gap-[3.5rem] mt-[1rem]">
            {/* CARD UNIDADES */}
            <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-[22.5rem] h-[30rem] p-[1.25rem] flex flex-col">
              <h3 className="text-sm font-semibold text-[hsl(var(--secondary))] mb-[0.5rem]">
                Selecione as unidades curriculares
              </h3>

              <div className="relative mb-[0.75rem]">
                <FiSearch className="absolute left-[0.75rem] top-[0.625rem] text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Buscar Unidade Curricular"
                  value={buscaUnidade}
                  onChange={(e) => setBuscaUnidade(e.target.value)}
                  className="w-full pl-[2.25rem] pr-[0.75rem] py-[0.5rem] text-sm border rounded-md border-[hsl(var(--border))] 
                             bg-white focus:outline-none focus:ring-1 
                             focus:ring-[hsl(var(--primary))] placeholder:text-[hsl(var(--muted-foreground))]"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-[0.25rem]">
                <div className="grid gap-[0.5rem]">
                  {unidadesFiltradas.map((uc) => (
                    <label
                      key={uc}
                      className="flex items-center gap-[0.75rem] text-sm cursor-pointer text-[hsl(var(--foreground))]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUnidades.includes(uc)}
                        onChange={() => toggleUnidade(uc)}
                        className="w-[1rem] h-[1rem] accent-[hsl(var(--primary))]"
                      />
                      <span className="truncate">{uc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD PROFESSORES */}
            <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-[22.5rem] h-[30rem] p-[1.25rem] flex flex-col">
              <h3 className="text-sm font-semibold text-[hsl(var(--secondary))] mb-[0.5rem]">
                Selecione os professores
              </h3>

              <div className="relative mb-[0.75rem]">
                <FiSearch className="absolute left-[0.75rem] top-[0.625rem] text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Buscar Professor"
                  value={buscaProfessor}
                  onChange={(e) => setBuscaProfessor(e.target.value)}
                  className="w-full pl-[2.25rem] pr-[0.75rem] py-[0.5rem] text-sm border rounded-md border-[hsl(var(--border))] 
                             bg-white focus:outline-none focus:ring-1 
                             focus:ring-[hsl(var(--primary))] placeholder:text-[hsl(var(--muted-foreground))]"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-[0.25rem]">
                <div className="grid gap-[0.5rem]">
                  {professoresFiltrados.map((prof) => (
                    <label
                      key={prof}
                      className="flex items-center gap-[0.75rem] text-sm cursor-pointer text-[hsl(var(--foreground))]"
                    >
                      <input
                        type="radio"
                        name="professor"
                        value={prof}
                        checked={selectedProfessor === prof}
                        onChange={() => setSelectedProfessor(prof)}
                        className="w-[1rem] h-[1rem] accent-[hsl(var(--primary))]"
                      />
                      <span className="truncate">{prof}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTÃO SALVAR */}
          <div className="flex justify-end mt-[1rem] w-[48.4rem] mx-auto">
            <div className="flex items-center gap-[0.75rem]">
              {showMessage && (
                <span className="text-[hsl(var(--primary))] text-sm font-medium">
                  Unidade salva com sucesso!
                </span>
              )}
              <button
                onClick={handleSalvar}
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] px-[1.5rem] py-[0.5rem] rounded-md text-sm font-medium shadow-md"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* LOG lateral */}
      <LogLateral
        titulo="Unidade Curricular"
        subtitulo="Professor"
        itens={salvos.map((s, i) => ({
          id: `${s.unidade}-${s.professor}-${i}`,
          unidade: s.unidade,
          professor: s.professor,
        }))}
        onRemover={(id) =>
          setSalvos((prev) => prev.filter((s, i) => `${s.unidade}-${s.professor}-${i}` !== id))
        }
        vazioTexto="Nenhuma unidade salva ainda"
        onProximo={() => router.push("/criar/conselho/representante")}
      />
    </div>
  );
}
