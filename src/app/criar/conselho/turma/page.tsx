"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/header/header";
import LogLateral from "@/components/sidebar/logLateral";
import MedModal from "@/components/modal/medModal";
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

  const [selected, setSelected] = useState<typeof turmas[number] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const turmasFiltradas = turmas.filter((t) =>
    t.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleRemover() {
    setSelected(null);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-100 w-full flex flex-col">
        <Header />

        <div className="flex w-full gap-6 px-6 mt-20 pb-10">

          {/* ------ COLUNA CENTRAL ------ */}
          <main className="flex-1 flex justify-center">
            <div className="flex flex-col items-center w-[48.4rem]">

              {/* CARD CABEÇALHO */}
              <div className="bg-white rounded-xl shadow-md p-6 border w-full">
                <h1 className="text-2xl font-semibold text-zinc-800">
                  Turma para o Pré-Conselho
                </h1>
                <p className="text-sm text-zinc-600 mt-1">
                  Selecione a turma desejada
                </p>
                <div className="border-t mt-3" />
              </div>

              {/* CARD CENTRAL */}
              <div className="bg-white rounded-xl border shadow-sm w-full h-[30rem] p-4 mt-6 flex flex-col">

                {/* BUSCA */}
                <div className="relative mb-3">
                  <FiSearch className="absolute left-3 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Buscar turma"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border rounded-md bg-white outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* LISTA SCROLL */}
                <div className="flex-1 overflow-y-auto pr-1">

                  <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-2 gap-4">
                    {turmasFiltradas.map((t) => (
                      <MedModal
                        key={t.sigla}
                        courseCode={t.sigla}
                        courseName={t.nome}
                        onClick={() => setSelected(t)}
                        className={
                          selected?.sigla === t.sigla
                            ? "border-2 border-teal-700"
                            : "border border-transparent"
                        }
                      >
                        <p>Selecione para visualizar no painel lateral</p>
                      </MedModal>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </main>

          {/* ------ LOG LATERAL ------ */}
          <LogLateral
            titulo="Turma"
            subtitulo="Informações"
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
            onProximo={() => {
              if (!selected) return;
              localStorage.setItem("turmaSelecionada", JSON.stringify(selected));
              router.push("/criar/conselho");
            }}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
