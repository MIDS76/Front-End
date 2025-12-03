"use client";

import { useEffect, useRef, useState } from "react";
import turmasData from "@/data/turma.json";
import { Turma } from "@/utils/types";
import MedModal from "@/components/modal/medModal";
import SearchBar from "@/components/input/searchBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ListaConselhos from "@/components/modal/listaConselhos";
import Paginacao from "@/components/paginacao/paginacao";
import { useAuth } from "@/context/AuthContext";
import BaixarDocumentosModal from "@/components/modal/BaixarDocumentosModal"; 

export default function PedagogicoPage() {
  const { user } = useAuth(); 

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
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);

  const [baixarModalOpen, setBaixarModalOpen] = useState(false);
  const [conselhoSelecionado, setConselhoSelecionado] = useState<any | null>(null);

  const [screenWidth, setScreenWidth] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScreenWidth = () => setScreenWidth(window.innerWidth);
    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => { window.removeEventListener("resize", updateScreenWidth); };
  }, []);

  useEffect(() => {
    const getTurmasPorPagina = () => {
      if (sideModalOpen) {
        if (screenWidth <= 1024) return 4;
        if (screenWidth <= 1366) return 6;
        return 12;
      } else {
        if (screenWidth <= 1024) return 8;
        if (screenWidth <= 1366) return 9;
        return 12;
      }
    };
    const turmasPorPagina = getTurmasPorPagina();
    const turmasArray = Object.values(turmasData).map((t) => ({
      id: t.id, nome: t.nomeCurso, curso: t.codigoTurma, dataInicio: t.dataInicio, dataFinal: t.dataFim,
    }));
    const query = searchQuery.toLowerCase().replaceAll(" ", "");
    const filtradas = turmasArray.filter((turma) => {
      const codigo = turma.curso.toLowerCase().replaceAll(" ", "");
      const nome = turma.nome.toLowerCase().replaceAll(" ", "");
      return codigo.includes(query) || nome.includes(query);
    });
    setTotalPages(Math.ceil(filtradas.length / turmasPorPagina));
    const inicio = paginaAtual * turmasPorPagina;
    const fim = inicio + turmasPorPagina;
    setFilteredTurmas(filtradas.slice(inicio, fim));
  }, [searchQuery, paginaAtual, screenWidth, sideModalOpen]);

  const handleOpenModal = (turma: Turma) => {
    if (selectedTurma?.id === turma.id) {
      setSideModalOpen(false);
      setSelectedTurma(null);
      return;
    }
    setSelectedTurma(turma);
    setSideModalOpen(true);
  };

  const handleBaixarDocumentos = (conselho: any) => {
    setConselhoSelecionado(conselho);
    setBaixarModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <main className="w-full flex flex-col">
        <div className="flex flex-row flex-auto">
          <section className="w-full max-h-full md:w-3/5 xl:w-3/4 h-full flex flex-col items-start p-4 pt-24 gap-y-4">

            <div className="ml-6 w-[calc(100%-3rem)] desktop:w-[35.8%] laptop:w-[47.5%]">
              <SearchBar
                texto="Todos os Conselhos"
                className="w-full" // SearchBar ocupa todo o espaço da div pai
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filter
                filtrosMostrar={{ aluno: false, turma: true, conselho: false }}
              />
            </div>

            <div
              className={`mt-6 w-full desktop:w-[75%] grid gap-4 px-6 ${
                sideModalOpen && screenWidth <= 1366
                  ? "tablet:grid-cols-1 tablet:w-[50%] laptop:grid-cols-2 laptop:w-[49%]"
                  : "tablet:grid-cols-2 laptop:grid-cols-4"
              }`}
            >
              <ListaTurmas />
            </div>

            <Paginacao
              paginaAtual={paginaAtual}
              setPaginaAtual={setPaginaAtual}
              totalPages={totalPages}
            />
          </section>

          <div ref={modalRef}>
            <ListaConselhos
              key={selectedTurma?.id}
              turma={selectedTurma}
              estaAberto={sideModalOpen}
              aoFechar={() => setSideModalOpen(false)}
              onBaixarDocumentos={handleBaixarDocumentos}
              role={user?.role ?? ""}
            />

            <BaixarDocumentosModal
              open={baixarModalOpen}
              onClose={() => setBaixarModalOpen(false)}
              conselho={conselhoSelecionado}
              role={user?.role}
            />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );

  function ListaTurmas() {
    if (!filteredTurmas.length)
      return (
        <MedModal loading courseCode="..." courseName="..." onClick={() => {}}>
          Nenhuma turma encontrada
        </MedModal>
      );

    return filteredTurmas.map((turma, index) => (
      <MedModal
        key={index}
        courseCode={turma.curso}
        courseName={turma.nome}
        onClick={() => handleOpenModal(turma)}
      >
        <b>Último conselho:</b> {dataAleatoria}
      </MedModal>
    ));
  }
}