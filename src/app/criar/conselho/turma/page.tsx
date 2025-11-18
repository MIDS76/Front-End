"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Filter } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
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
  ];

  // ⭐ Estado tipado automaticamente pelo array
  const [selected, setSelected] = useState<typeof turmas[number] | null>(null);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 w-full">
        <Header />

        <div className="flex gap-4 w-full px-6 py-6 tablet:px-10 laptop:px-16 desktop:px-32">

          {/* LEFT AREA */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-sm p-6 tablet:p-8">
              <h1 className="text-xl tablet:text-2xl laptop:text-3xl font-semibold text-zinc-800">
                Turma para o Pré-Conselho
              </h1>
              <p className="text-sm tablet:text-base text-zinc-600 mt-2">
                Selecione a turma para o pré-conselho
              </p>
              <div className="w-full h-px bg-zinc-200 mt-4" />
            </div>

            {/* Search + Cards */}
            <div className="bg-white rounded-2xl shadow-sm p-4 tablet:p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center bg-zinc-100 rounded-xl px-4 py-2 w-full">
                  <FiSearch className="text-zinc-500 text-lg" />
                  <input
                    type="text"
                    placeholder="Procure por uma turma"
                    className="bg-transparent outline-none ml-3 text-sm w-full"
                  />
                </div>

                <button className="p-3 bg-zinc-200 rounded-xl hover:bg-zinc-300 transition">
                  <Filter size={18} />
                </button>
              </div>

              {/* CARDS GRID */}
              <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-4">
                {turmas.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(t)}
                    className={`rounded-xl shadow-sm text-left p-4 transition border
                      ${
                        selected?.sigla === t.sigla
                          ? "bg-teal-700 text-white border-teal-800"
                          : "bg-teal-600 text-white/90 border-transparent"
                      }`}
                  >
                    <h3 className="text-lg font-bold">{t.sigla}</h3>
                    <p className="text-sm">{t.nome}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden tablet:flex flex-col bg-zinc-200 w-72 rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-700 mb-4">Turma</h2>

            {selected ? (
              <div className="flex justify-between bg-white rounded-xl p-3 shadow-sm items-center">
                <div>
                  <p className="font-semibold">{selected.sigla}</p>
                  <p className="text-xs text-zinc-500">{selected.nome}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ) : (
              <p className="text-sm text-zinc-600 italic">
                Nenhuma turma selecionada
              </p>
            )}

            <div className="mt-auto w-full">
              <Button
                className="w-full mt-6 py-5 text-sm tablet:text-base"
                onClick={() => {
                  if (!selected) return;

                 
                  localStorage.setItem(
                    "turmaSelecionada",
                    JSON.stringify(selected)
                  );

                  router.push("/criar/conselho");
                }}
              >
                Próximo passo ›
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
