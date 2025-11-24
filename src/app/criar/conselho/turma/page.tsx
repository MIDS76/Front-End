"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/header/header";
import LogLateral from "@/components/sidebar/logLateral";
import { useRouter } from "next/navigation";

export default function SelecionarTurmaPreConselho() {
  const router = useRouter();

  const turmas = [
    { sigla: "MI 77", nome: "Desenvolvimento de Sistemas" },
    { sigla: "MI 78", nome: "Desenvolvimento de Sistemas" },
    { sigla: "MI 79", nome: "Desenvolvimento de Sistemas" },
    { sigla: "MI 80", nome: "Desenvolvimento de Sistemas" },
    { sigla: "MI 81", nome: "Desenvolvimento de Sistemas" },
    { sigla: "MT 74", nome: "Eletromecânica" },
    { sigla: "MT 76", nome: "Eletromecânica" },
    { sigla: "ET 81", nome: "Eletroeletrônica Industrial" },
    { sigla: "ET 75", nome: "Eletroeletrônica Industrial" },
    { sigla: "ET 99", nome: "Eletroeletrônica Industrial" },
    { sigla: "ET 45", nome: "Eletroeletrônica Industrial" },
    { sigla: "ET 95", nome: "Eletroeletrônica Industrial" },
    { sigla: "ET 55", nome: "Eletroeletrônica Industrial" },
    { sigla: "ET 78", nome: "Eletroeletrônica Industrial" },
    { sigla: "ET 79", nome: "Eletroeletrônica Industrial" },
    { sigla: "ET 58", nome: "Eletroeletrônica Industrial" },
  ];

  const [selected, setSelected] = useState<typeof turmas[number] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [erroSelecao, setErroSelecao] = useState("");

  const turmasFiltradas = turmas.filter(
    (t) =>
      t.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleRemover() {
    setSelected(null);
  }

  function handleProximo() {
    if (!selected) {
      setErroSelecao("Você precisa selecionar uma turma antes de continuar.");
      return;
    }

    localStorage.setItem("turmaSelecionada", JSON.stringify(selected));
    router.push("/criar/conselho");
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[hsl(var(--background))] w-full flex flex-col">
        <Header />

        <div className="flex w-full mt-[5rem]">
          {/* CENTRO */}
          <main className="flex-1 flex justify-center px-10">
            <div className="flex flex-col items-center w-full max-w-[60rem]">

              {/* CABEÇALHO */}
              <div className="bg-[hsl(var(--card))] rounded-xl shadow-md p-6 border border-[hsl(var(--border))] w-full">
                <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
                  Turma para o Pré-Conselho
                </h1>

                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Selecione a turma para o pré-conselho
                </p>

                <div className="border-t mt-4 border-[hsl(var(--border))]" />
              </div>

              {/* GRID + BUSCA */}
              <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm w-full h-[34rem] p-5 mt-6 flex flex-col">

                {/* BUSCA */}
                <div className="relative w-full mb-4">
                  <FiSearch className="absolute left-4 top-2.5 text-gray-500" />

                  <input
                    type="text"
                    placeholder="Buscar Unidade Curricular"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
                      w-full
                      pl-10 pr-4 py-2.5
                      bg-white
                      rounded-xl
                      border border-gray-300
                      text-sm
                      text-gray-700
                      placeholder:text-gray-500
                      focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]
                      transition
                    "
                  />
                </div>

                {/* GRID */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {turmasFiltradas.map((t) => {
                      const isSelected = selected?.sigla === t.sigla;

                      return (
                        <div
                          key={t.sigla}
                          onClick={() => {
                            setSelected(t);
                            setErroSelecao("");
                          }}
                          className={`
                            cursor-pointer rounded-xl overflow-hidden shadow-md border
                            transition-all duration-300
                            ${
                              isSelected
                                ? "border-[hsl(var(--primary))] scale-[1.02]"
                                : "border-transparent hover:scale-[1.01]"
                            }
                          `}
                        >

                          {/* Topo */}
                          <div
                            className={`
                              p-4 transition-colors duration-300
                              ${isSelected ? "bg-[#0E2A32]" : "bg-[#2F6B73]"}
                              text-white
                            `}
                          >
                            <h2 className="text-xl font-semibold">{t.sigla}</h2>
                            <p className="text-sm opacity-90">{t.nome}</p>
                          </div>

                          {/* Status */}
                          <div className="bg-white p-4">
                            <p className="text-sm font-semibold text-gray-700">
                              Status: Não iniciado
                            </p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* MENSAGEM DE ERRO */}
              {erroSelecao && (
                <p className="text-red-600 text-sm mt-3 font-medium">
                  {erroSelecao}
                </p>
              )}
            </div>
          </main>

          {/* LATERAL */}
          <LogLateral
            titulo="Turma"
            itens={
              selected
                ? [
                    {
                      id: selected.sigla,
                      unidade: selected.sigla,
                      professor: selected.nome,
                    },
                  ]
                : []
            }
            onRemover={handleRemover}
            vazioTexto="Nenhuma turma selecionada"
            onProximo={handleProximo}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
