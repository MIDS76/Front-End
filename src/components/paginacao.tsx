import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PaginacaoProps {
  paginaAtual: number;
  setPaginaAtual: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export default function Paginacao({
  paginaAtual,
  setPaginaAtual,
  totalPages,
}: PaginacaoProps) {
  const ultimaPagina = paginaAtual >= totalPages - 1;
  const primeiraPagina = paginaAtual <= 0;
  const muted =
    "text-muted-foreground bg-muted cursor-default hover:text-muted-foreground pointer-events-none";

  const renderPaginas = () => {
    const pages = [];

    const renderPage = (i: number) => (
      <PaginationItem key={i}>
        <PaginationLink
          isActive={paginaAtual === i}
          onClick={() => setPaginaAtual(i)}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );

    pages.push(renderPage(0));

    if (paginaAtual > 2) {
      pages.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    for (let i = paginaAtual - 1; i <= paginaAtual + 1; i++) {
      if (i > 0 && i < totalPages - 1) {
        pages.push(renderPage(i));
      }
    }

    if (paginaAtual < totalPages - 3) {
      pages.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    if (totalPages > 1) {
      pages.push(renderPage(totalPages - 1));
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious
          className={primeiraPagina ? muted : ""}
          onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 0))}
        />
        {renderPaginas()}
        <PaginationNext
          className={ultimaPagina ? muted : ""}
          onClick={() =>
            setPaginaAtual((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
          }
        />
      </PaginationContent>
    </Pagination>
  );
}
