"use client";

import { useEffect, useRef, useState } from "react";
import turmasData from "@/data/turma.json";
import { Turma } from "@/utils/types";
import MedModal from "@/components/modal/medModal";
import SearchBar from "@/components/input/searchBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ListaConselhos from "@/components/modal/listaConselhos"; 
import Paginacao from "@/components/paginacao/paginacao";

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

  // Estado para verificar a largura da tela
  const [screenWidth, setScreenWidth] = useState(0);

  // Ref para o modal
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScreenWidth = () => setScreenWidth(window.innerWidth);
    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  // useEffect para fechar o modal ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSideModalOpen(false);
      }
    };

    if (sideModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sideModalOpen]);
  
  useEffect(() => {
    // Função para calcular turmas por página baseado na largura da tela e estado do modal
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
  }, [searchQuery, paginaAtual, screenWidth, sideModalOpen]); 

  const handleOpenModal = (turma: Turma) => {
    if (selectedTurma.id === turma.id && sideModalOpen) {
      setSideModalOpen(false);
      setTimeout(() => {
        setSideModalOpen(true);
      }, 300); 
    } else {
      setSelectedTurma(turma);
      setSideModalOpen(true);
    }
  };

  return (
    <ProtectedRoute>
      <main className="w-full flex flex-col">
        <div className="flex flex-row flex-auto">
          <section className="w-full max-h-full md:w-3/5 xl:w-3/4 h-full flex flex-col items-start p-4 pt-24 gap-y-4">
            <SearchBar
              texto="Todos os Conselhos"
              className="w-full xl:w-3/5 2xl:w-2/5"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter
              filtrosMostrar={{ aluno: false, turma: true, conselho: false }}
            />

            {/* Grid de Turmas com responsividade */}
            <div className={` mt-6 w-full desktop:w-[75%] grid gap-4 px-6 ${sideModalOpen && screenWidth <= 1366 ? 'tablet:grid-cols-1 tablet:w-[50%] laptop:grid-cols-2 laptop:w-[49%]' : 'tablet:grid-cols-2  laptop:grid-cols-4 '}`}>
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
              turma={selectedTurma}
              estaAberto={sideModalOpen}
              aoFechar={() => setSideModalOpen(false)}
            />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );

  function ListaTurmas() {
    if (!filteredTurmas.length)
      return (
        <MedModal loading courseCode="..." courseName="..." onClick={() => { }} >
          Nenhuma turma encontrada
        </MedModal>
      );

    return filteredTurmas.map((turma, index) => (
      <MedModal
        key={index}
        courseCode={turma.codigoTurma}
        courseName={turma.nomeCurso}
        onClick={() => handleOpenModal(turma)}
      >
        <b>Último conselho:</b> {dataAleatoria}
      </MedModal>
    ));
  }
}
