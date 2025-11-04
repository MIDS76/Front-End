import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ButtonTT from "./button/ButtonTT";
import EditUserDialog from "./modal/editUserDialog";
import { Conselho } from "@/utils/types";
import { Usuario } from "@/utils/types";
import { ListCell } from "./listcell";

interface ListaProps {
  className?: string;
  usuarios: Usuario[];
  professor?: Usuario;
  tipo: "checkbox"
    | "edit"
    | "add"
    | "excluir"
    | "conselho"
    | "limpa";
  setSelectedContact: (contact: Usuario) => void;
  loading?: boolean;
  selectedUsers?: Usuario[];
  conselho?: Conselho;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  searchQuery?: string;
}

export default function Lista({
  searchQuery: searchQueryProp,
  setSearchQuery: setSearchQueryProp,
  className,
  usuarios,
  tipo,
  loading,
  selectedUsers,
  conselho,
  professor,
  isDialogOpen,
  setIsDialogOpen,
  ...props
}: ListaProps) {
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>();

  const toggleUsuario = (usuario: Usuario) => {
    props.setSelectedContact(usuario);
    setSelectedUsuario(usuario);
  };

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (loading) return;

    setFilteredUsers(
      usuarios?.filter((medModal) => {
        const searchQueryLower = searchQuery.toLowerCase().replaceAll(" ", "");
        return (
          medModal.nome.toLowerCase().includes(searchQueryLower) ||
          medModal.email.toLowerCase().includes(searchQueryLower) ||
          medModal.role.toLowerCase().includes(searchQueryLower)
        );
      })
    );
  }, [loading, searchQuery, usuarios]);

  const [editingUser, setEditingUser] = useState<Usuario>({} as Usuario);

  return (
    <section className="flex flex-col items-stretch justify-start w-full gap-4 ">
      <div className="flex items-center gap-2 px-4">

        {(tipo === "excluir") && (
          <ButtonTT
            variant="secondary"
            tooltip="Adicionar usuário"
            mode="default"
          >
            Adicionar
          </ButtonTT>
        )}
      </div>
      <ScrollArea className={cn(className, "flex flex-col")}>
        { filteredUsers?.map((usuario, index) => (
              <ListCell
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                usuarioProfessor={professor}
                key={index}
                usuario={usuario}
                conselho={conselho!}
                toggleSelected={() => toggleUsuario(usuario)}
                tipo={tipo}
                isUserAlreadySelected={selectedUsers?.some(
                  (u) => u.id === usuario.id
                )}
                setEditingUser={setEditingUser}
                removeUser={() => {
                  setFilteredUsers(
                    filteredUsers?.filter((user) => user.id !== usuario.id)
                  );
                }}
                copy
              />
            ))}
      </ScrollArea>
      {tipo === "edit" && (
        <EditUserDialog
          usuario={editingUser!}
          setUsuario={setEditingUser}
          isOpen={isDialogOpen}
          setOpen={setIsDialogOpen}
        />
      )}
    </section>
  );
}