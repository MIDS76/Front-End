"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import LogLateral from "@/components/sidebar/logLateral";
import InfoCard from "@/components/card/cardTituloTelas";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";

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
  const [buscaProfessor, setBuscaProfessor] = useState("");
  const [buscaUnidade, setBuscaUnidade] = useState("");
  const [erros, setErros] = useState<{ professor?: boolean; unidade?: boolean }>({});

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

  useEffect(() => {
    const carregarDados = () => {
      const dadosSalvos = localStorage.getItem("conselhoSalvos");
      if (dadosSalvos) {
        try {
          setSalvos(JSON.parse(dadosSalvos));
        } catch {
          localStorage.removeItem("conselhoSalvos");
        }
      }
    };

    carregarDados();
    window.addEventListener("focus", carregarDados);
    return () => window.removeEventListener("focus", carregarDados);
  }, []);

  useEffect(() => {
    if (salvos.length > 0) {
      localStorage.setItem("conselhoSalvos", JSON.stringify(salvos));
    }
  }, [salvos]);

  function handleSalvar() {
    const novosErros: { professor?: boolean; unidade?: boolean } = {};

    if (selectedUnidades.length === 0) novosErros.unidade = true;
    if (!selectedProfessor) novosErros.professor = true;

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      toast.error("Selecione ao menos um professor e uma unidade curricular antes de salvar!");
      return;
    }

    setErros({});
    const novos = selectedUnidades.map((u) => ({
      unidade: u,
      professor: selectedProfessor!,
    }));

    const atualizados = [...salvos, ...novos];
    setSalvos(atualizados);
    localStorage.setItem("conselhoSalvos", JSON.stringify(atualizados));

    setSelectedUnidades([]);
    setSelectedProfessor(null);

    toast.success("Unidade(s) e professor adicionados com sucesso!");
  }

  function handleRemover(unidade: string) {
    const atualizados = salvos.filter((s) => s.unidade !== unidade);
    setSalvos(atualizados);
    localStorage.setItem("conselhoSalvos", JSON.stringify(atualizados));
  }

  function handleProximoPasso() {
    localStorage.setItem("conselhoSalvos", JSON.stringify(salvos));

    setTimeout(() => {
      router.push("/criar/conselho/representante");
    }, 10);
  }

  return (
      <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <main className="flex-1 px-4 pt-4 pb-4 mt-[6.3rem] laptop:px-20 desktop: flex-1 px-[3rem] pt-[2rem] pb-[3rem] mt-[5rem]">
          <div className="max-w-[30rem] laptop:max-w-[50rem] desktop: max-w-[80rem] mx-auto">
            <div className="flex justify-center items-center mt-[1.5rem] desktop: flex justify-center mt-[1.5rem]">
              <InfoCard
                titulo="Conselho da Turma MI 76"
                descricao="Selecione os professores de cada unidade curricular"
                className="w-full sm:w-[48.5rem] desktop:w-[60rem]"
              />
            </div>

            <div className="flex justify-center items-center flex-col sm:flex-row gap-4 sm:gap-[3.5rem] mt-6 sm:mt-[1rem] laptop:flex-row laptop:gap-[3.5rem] desktop:gap-[5rem]">
              {/* PROFESSORES */}
              <div
                className={`bg-[hsl(var(--card))] rounded-xl border shadow-sm w-full sm:w-[22.5rem] h-[30rem] p-[1.25rem] flex flex-col ${erros.professor ? "border-destructive" : "border-[hsl(var(--border))]" } laptop:w-[22.5rem] desktop:w-[25rem]`}
              >
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
                    className="w-full pl-[2.25rem] pr-[0.75rem] py-[0.5rem] text-sm border rounded-md border-[hsl(var(--border))] bg-white focus:ring-1 focus:ring-[hsl(var(--primary))]"
                  />
                </div>

                <div className="flex-1 overflow-y-auto pr-[0.25rem]">
                  <div className="grid gap-[0.5rem]">
                    {professoresFiltrados.map((prof) => (
                      <label key={prof} className="flex items-center gap-[0.75rem] text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="professor"
                          value={prof}
                          checked={selectedProfessor === prof}
                          onChange={() => {
                            setSelectedProfessor(prof);
                            setErros((prev) => ({ ...prev, professor: false }));
                          }}
                          className="w-[1rem] h-[1rem] accent-[hsl(var(--primary))]"
                        />
                        <span className="truncate">{prof}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {erros.professor && <p className="text-destructive text-sm mt-2">Selecione um professor!</p>}
              </div>

              {/* UNIDADES */}
              <div
                className={`bg-[hsl(var(--card))] rounded-xl border shadow-sm w-full sm:w-[22.5rem] h-[30rem] p-[1.25rem] flex flex-col ${erros.unidade ? "border-destructive" : "border-[hsl(var(--border))]" } laptop:w-[22.5rem] desktop:w-[25rem]`}
              >
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
                    className="w-full pl-[2.25rem] pr-[0.75rem] py-[0.5rem] text-sm border rounded-md border-[hsl(var(--border))] bg-white focus:ring-1 focus:ring-[hsl(var(--primary))]"
                  />
                </div>

                <div className="flex-1 overflow-y-auto pr-[0.25rem]">
                  <div className="grid gap-[0.5rem]">
                    {unidadesFiltradas.map((uc) => (
                      <label key={uc} className="flex items-center gap-[0.75rem] text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUnidades.includes(uc)}
                          onChange={() => {
                            toggleUnidade(uc);
                            setErros((prev) => ({ ...prev, unidade: false }));
                          }}
                          className="w-[1rem] h-[1rem] accent-[hsl(var(--primary))]"
                        />
                        <span className="truncate">{uc}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {erros.unidade && <p className="text-destructive text-sm mt-2">Selecione ao menos uma unidade!</p>}
              </div>
            </div>

          {/* BOTÃO SALVAR */}
          <div className="flex justify-end mt-[1rem] w-full mx-auto">
            <ButtonTT
              mode="default"
              onClick={handleSalvar}
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] px-[1.5rem] py-[0.5rem] rounded-md text-sm font-medium shadow-md transition-all duration-200"
            >
              Salvar
            </ButtonTT>
          </div>
          </div>
        </main>

        <LogLateral
          titulo="Unidade Curricular"
          subtitulo="Professor"
          itens={salvos.map((s, i) => ({
            id: `${s.unidade}-${s.professor}-${i}`,
            unidade: s.unidade,
            professor: s.professor,
          }))}
          onRemover={handleRemover}
          vazioTexto="Nenhuma unidade salva ainda"
          onProximo={handleProximoPasso}
        />
      </div>
  );
}
