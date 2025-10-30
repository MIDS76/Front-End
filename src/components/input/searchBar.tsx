import ButtonTT from "../button/ButtonTT";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import FiltrosPesquisa from "../modal/modalFiltroInicio";

interface SearchBarParams {
  className?: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  filter?: boolean;
  children?: React.ReactNode;
}

export default function SearchBar({
  className,
  searchQuery,
  setSearchQuery,
  placeholder = "Pesquisar",
  filter,
  children,
}: SearchBarParams) {
  return (
    <div
      className={
        "flex flex-row items-center gap-2 justify-between " + className
      }
    >
      <Input
        placeholder={placeholder}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          e.target.focus();
        }}
        value={searchQuery}
      />
      {children}
      {filter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <ButtonTT
                tooltip="Visualizar e aplicar filtros"
                mode="small"
                icon={"MdFilterAlt"}
                className="shrink-0"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="p-2 py-2 pt-0 select-none"
          >
            <FiltrosPesquisa />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
