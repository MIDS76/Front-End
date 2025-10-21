import {
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MdSortByAlpha } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

export default function FiltrosPesquisa() {
  return (
    <>
      <DropdownMenuLabel className="text-lg font-bold text-accent-foreground p-4 pl-2 pb-1">
        Filtros
      </DropdownMenuLabel>

      <div className="flex flex-col gap-2 px-2 pb-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-row items-center font-medium text-sm text-accent-foreground ml-[-8px]">
            <MdSortByAlpha className="mr-2" size={16} /> Nome da Turma
          </DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer text-sm mx-4">
            A - Z
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm mx-4">
            Z - A
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-row items-center font-medium text-sm text-accent-foreground ml-[-8px]">
            <MdSortByAlpha className="mr-2" size={16} /> Nome do Curso
          </DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer text-sm mx-4">
            A - Z
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm mx-4">
            Z - A
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-row items-center font-medium text-sm text-accent-foreground ml-[-8px]">
            <IoDocumentText className="mr-2" size={16} /> Etapa do Conselho
          </DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer text-sm mx-4">
            Pré-Conselho
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm mx-4">
            Reunião
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm mx-4">
            Conversas Particulares
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm mx-4">
            Resultados
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </div>
    </>
  );
}
