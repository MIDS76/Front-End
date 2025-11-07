"use client";

import { useEffect, useState } from "react";
import turmasData from "@/data/turma.json";
import { Turma } from "@/utils/types";
import MedModal from "@/components/modal/medModal";
import SearchBar from "@/components/input/searchBar";
import Paginacao from "@/components/paginacao";
import ProtectedRoute from "@/components/ProtectedRoute";
import ListaConselhos from "@/components/modal/listaConselhos"; // Adicione este import

export default function PedagogicoPage() {
  const [dataAleatoria] = useState(() => {
    const hoje = new Date();
    const diasAleatorios = Math.floor(Math.random() * 90);
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - diasAleatorios);
    return data.toLocaleDateString();
  });

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTurmas, setFilteredTurmas] = useState<Turma[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState({} as Turma);

  // ✅ Converte o objeto para array com Object.values()
  useEffect(() => {
    const turmasPorPagina = 12;

    // Converte o objeto turmasData em um array
    const turmasArray = Object.values(turmasData);

    // Filtro de pesquisa
    const query = searchQuery.toLowerCase().replaceAll(" ", "");
    const filtradas = turmasArray.filter((turma) => {
      const codigo = turma.codigoTurma?.toLowerCase().replaceAll(" ", "");
      const curso = turma.nomeCurso?.toLowerCase().replaceAll(" ", "");
      return codigo.includes(query) || curso.includes(query);
    });

    setTotalPages(Math.ceil(filtradas.length / turmasPorPagina));

    const inicio = paginaAtual * turmasPorPagina;
    const fim = inicio + turmasPorPagina;
    setFilteredTurmas(filtradas.slice(inicio, fim));
  }, [searchQuery, paginaAtual]);

  return (
    <ProtectedRoute>
      <main className="w-full flex flex-col">
        <div className="flex flex-row flex-auto">
          <section className="w-full max-h-full md:w-3/5 xl:w-3/4 h-full flex flex-col items-start p-4 pt-24 gap-y-4">
            <SearchBar
              className="w-full xl:w-3/5 2xl:w-2/5 px-4"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter
              filtrosMostrar={{ aluno: false, turma: true, conselho: false }}
            />

            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 px-4">
              <ListaTurmas />
            </div>

            <Paginacao
              paginaAtual={paginaAtual}
              setPaginaAtual={setPaginaAtual}
              totalPages={totalPages}
            />
          </section>

          {/* Aqui é onde fazemos a substituição do ConselhosModal pelo ListaConselhos */}
            <ListaConselhos
              turma={selectedTurma}
              estaAberto={sideModalOpen}
              aoFechar={() => setSideModalOpen(false)}
            />

        </div>
      </main>
    </ProtectedRoute>
  );

  function ListaTurmas() {
    if (!filteredTurmas.length)
      return (
        <MedModal loading courseCode="..." courseName="..." onClick={() => { }}>
          Nenhuma turma encontrada
        </MedModal>
      );

    return filteredTurmas.map((turma, index) => (
      <MedModal
        key={index}
        courseCode={turma.codigoTurma}
        courseName={turma.nomeCurso}
        onClick={() => {
          if (sideModalOpen && selectedTurma.id !== turma.id) {
            setSideModalOpen(false);
            setTimeout(() => {
              setSideModalOpen(true);
              setSelectedTurma(turma);
            }, 300);
          } else {
            setSideModalOpen(true);
            setSelectedTurma(turma);
          }
        }}
      >
        <b>Último conselho:</b> {dataAleatoria}
      </MedModal>
    ));
  }
}
