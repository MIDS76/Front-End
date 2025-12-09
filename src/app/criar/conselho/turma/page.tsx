"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/header/header";
import LogLateral from "@/components/sidebar/logLateral";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/input/searchBar";
import MedModal from "@/components/modal/medModal";
import { toast } from "sonner";
import { buscarTurmas } from "@/api/turmas";
import { Turma } from "@/utils/types";

export default function SelecionarTurmaPreConselho() {
  const router = useRouter();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selected, setSelected] = useState<Turma | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [erroSelecao, setErroSelecao] = useState("");

  useEffect(() => {
    const carregarTurmas = async () => {
      const data = await buscarTurmas();

      if (!data) {
        toast.error("Erro ao carregar turmas");
        return;
      }

      setTurmas(data);
    };

    carregarTurmas();
  }, []);

  const turmasFiltradas = turmas.filter(
    (t) =>
      t.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleRemover() {
    setSelected(null);
  }

  function handleProximo() {
    if (!selected) {
      toast.error("Você precisa selecionar uma turma antes de continuar.");
      return;
    }

    localStorage.setItem("turmaSelecionada", JSON.stringify(selected));
    router.push("/criar/conselho/representante");
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
              <div className="bg-[hsl(var(--card))] rounded-xl shadow-md p-6 border border-[hsl(var(--border))] w-full mt-7">
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
                <div className="w-full mb-4 flex items-center gap-4 flex-wrap">
                  <SearchBar
                    className="flex-1 min-w-[250px]"
                    searchQuery={searchTerm}
                    setSearchQuery={setSearchTerm}
                    filter
                    filtrosMostrar={{
                      usuario: false,
                      turma: true,
                      conselho: false,
                    }}
                  />
                </div>

                {/* GRID — AGORA COM MedModal */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-4">
                    {turmasFiltradas.map((t) => {
                      const isSelected = selected?.id === t.id;

                      return (
                        <MedModal
                          key={t.id}
                          courseCode={t.nome}
                          courseName={t.curso}
                          onClick={() => {
                            setSelected(t);
                            setErroSelecao("");
                          }}
                          className={`
                            transition-all duration-300 cursor-pointer
                            ${isSelected
                              ? "border-2 border-[hsl(var(--primary))] scale-[1.02]"
                              : "hover:scale-[1.01]"
                            }
                          `}
                        >
                          <p className="font-medium text-sm">
                            Status:{" "}
                            <span className="text-muted-foreground">
                              Não iniciado
                            </span>
                          </p>
                        </MedModal>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ERRO */}
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
                    id: selected.id,
                    unidade: selected.nome,
                    professor: selected.curso,
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
