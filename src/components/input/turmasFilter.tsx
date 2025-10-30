import { useEffect } from "react";
import { Turma } from "../modal/conselhosModal";
import SearchBar from "./searchBar";

interface TurmaFilterProps {
  turmas: Turma[];
  setFiltered: React.Dispatch<React.SetStateAction<Turma[]>>;
  filtros?: boolean;
  className?: string;
  loading?: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function TurmaFilter({
  loading,
  turmas,
  setFiltered,
  filtros,
  className,
  searchQuery,
  setSearchQuery,
}: TurmaFilterProps) {
  const filteredMedModals = loading
    ? turmas
    : turmas?.filter((medModal) => {
        const courseCode = medModal.codigoTurma
          .toLowerCase()
          .replaceAll(" ", "");
        const courseName = medModal.nomeCurso.toLowerCase().replaceAll(" ", "");
        const searchQueryLower = searchQuery.toLowerCase().replaceAll(" ", "");
        return (
          courseCode.includes(searchQueryLower) ||
          courseName.includes(searchQueryLower)
        );
      });

  useEffect(() => {
    setFiltered(filteredMedModals!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <>
      <SearchBar
        className={className}
        placeholder="Buscar uma turma"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filtros}
      />
    </>
  );
}
