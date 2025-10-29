"use client";

import MedModal from "@/components/modal/medModal";
import { useEffect, useState } from "react";
import ConselhosModal from "@/components/modal/conselhosModal";
import { Turma } from "@/utils/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import { Page } from "@/utils/types";
import Paginacao from "@/components/paginacao";
import TurmaFilter from "@/components/input/turmasFilter";

export default function LandingPage() {
  const [dataAleatoria] = useState(() => {
    const hoje = new Date();
    const diasAleatorios = Math.floor(Math.random() * 90);
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - diasAleatorios);
    return data.toLocaleDateString();
  });

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useSWR<Page<Turma>>(
    `http://localhost:8099/api/turmas/listar?page=${paginaAtual}&size=12&nomeCurso=${searchQuery}&codigoTurma=${searchQuery}`,
    fetcher
  );
  const [totalPages, setTotalPages] = useState(0);
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState({} as Turma);

  const [filteredMedModals, setFilteredMedModals] = useState<Turma[]>(
    data?.content || []
  );

  useEffect(() => {
    if (data?.content) {
      setFilteredMedModals(data.content);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  useEffect(() => {
    setPaginaAtual(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedTurma) return;
  }, [selectedTurma]);

  return (
    <main className="w-full flex flex-col">
      <div className="flex flex-row flex-auto">
        <section className="w-full max-h-full md:w-3/5 xl:w-3/4 h-full flex flex-col items-start p-4 pt-16 gap-y-4">
          <h2 className=" font-title text-2xl font-bold text-accent-foreground px-4">
            Todas as turmas
          </h2>
          <TurmaFilter
            className="w-full xl:w-3/5 2xl:w-2/5 px-4"
            filtros
            turmas={data?.content ?? []}
            setFiltered={setFilteredMedModals}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            loading={isLoading || error}
          />
          <ScrollArea className="w-full h-[500px] mt-8 ">
            <ul className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full px-4">
              <ListaTurmas />
            </ul>
          </ScrollArea>
          
          <Paginacao
            paginaAtual={paginaAtual}
            setPaginaAtual={setPaginaAtual}
            totalPages={totalPages}
          />
        </section>
        <section
          className={`${
            sideModalOpen ? "pointer-events-auto" : "pointer-events-none"
          } md:h-auto absolute right-0 w-3/4 md:w-2/5 xl:w-1/4 md:flex flex-col items-center justify-center md:bg-accent bg-none overflow-x-hidden`}
        >
          <p className="hidden md:block md:absolute bottom-1/2 text-muted-foreground">
            Selecione uma turma
          </p>
          <ConselhosModal
            turma={selectedTurma}
            isOpen={sideModalOpen}
            onClose={() => setSideModalOpen(false)}
          />
        </section>
      </div>
    </main>
  );

  function ListaTurmas() {
    if (isLoading || error)
      return (
        <>
          <MedModal
            loading
            courseCode="..."
            courseName="..."
            onClick={() => {}}
          >
            ...
          </MedModal>
        </>
      );

    return filteredMedModals?.map((medModal, index) => (
      <MedModal
        key={index}
        courseCode={medModal.codigoTurma}
        courseName={medModal.nomeCurso}
        onClick={() => {
          if (sideModalOpen && selectedTurma.id !== medModal.id) {
            setSideModalOpen(false);
            setTimeout(() => {
              setSideModalOpen(true);
              setSelectedTurma(medModal);
            }, 300);
          } else {
            setSideModalOpen(true);
            setSelectedTurma(medModal);
          }
        }}
      >
        <b>Último conselho:</b> {dataAleatoria}
      </MedModal>
    ));
  }
}



