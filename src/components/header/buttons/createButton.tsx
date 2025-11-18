"use client";

import { useState } from "react";
import ButtonTT from "../../button/ButtonTT";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import NovoUserModal from "../../modal/novoUserModal";
import { MdManageAccounts } from "react-icons/md";

export default function CreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCreateUserClick = () => {
    setIsOpen(false);
    setDropdownOpen(false);

    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <div>
          <ButtonTT
            tooltip="Criar turmas, eventos de conselho e usuários"
            icon="Plus"
            mode="small"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2 " align="end">
        <DropdownMenuLabel className="p-0 m-0 select-none">
          <ButtonTT
            tooltip="Entrar para mais opções"
            mode="default"
            variant={"ghost"}
            className="hover:bg-transparent hover:underline hover:decoration-2 font-bold my-1 w-full text-lg py-6 pb-8 border-b rounded-b-none border-foreground/10"
            onClick={() => {
              open("/gerenciamento/", "_self");
            }}
          >
            <MdManageAccounts className="scale-150" />
            Menu de Gerenciamento
          </ButtonTT>
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={handleCreateUserClick}
          className="cursor-pointer hover:bg-accent text-base"
        >
          <FaUserPlus />
          <span>Criar usuário</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-accent text-base"
          onClick={() => open("/criar/turma", "_self")}
        >
          <BsFillPeopleFill />
          <span>Criar turma</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-accent text-base"
          onClick={() => open("/criar/conselho/turma", "_self")}

        >
          <IoDocumentText />
          <span>Criar conselho</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <NovoUserModal isOpen={isOpen} setOpen={setIsOpen} />
    </DropdownMenu>
  );
}
