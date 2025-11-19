import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditUserDialog from "../modal/editUserDialog";
import { Conselho, Usuario } from "@/utils/types";
import ListCell from "./listcell";

interface ListaProps {
  className?: string;
  usuarios: Usuario[];
  tipo: "checkbox" | "edit" | "conselho" | "limpa";
  loading?: boolean;
  conselho?: Conselho;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  onSelect?: (usuario: Usuario) => void;
  usuarioSelecionado?: Usuario | null;
  selecionados?: Usuario[]; 
}

export default function Lista({
  className,
  usuarios,
  tipo,
  conselho,
  isDialogOpen,
  setIsDialogOpen,
  onSelect,
  usuarioSelecionado,
  selecionados = [], 
}: ListaProps) {
  const [selectedUsuarios, setSelectedUsuarios] = useState<Usuario[]>([]);
  const [editingUser, setEditingUser] = useState<Usuario>({} as Usuario);
  const [updatedUsuarios, setUpdatedUsuarios] = useState<Usuario[]>(usuarios);

  useEffect(() => {
    setUpdatedUsuarios(usuarios);
  }, [usuarios]);

  const toggleUsuario = (usuario: Usuario) => {
    setSelectedUsuarios((prev) =>
      prev.some((u) => u.id === usuario.id)
        ? prev.filter((u) => u.id !== usuario.id)
        : [...prev, usuario]
    );
  };

  const handleUpdateUser = (updatedUsuario: Usuario) => {
    setUpdatedUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id === updatedUsuario.id ? updatedUsuario : usuario
      )
    );
  };

  return (
    <section className="flex flex-col items-stretch justify-start w-full gap-4">
      <ScrollArea className={cn(className, "flex flex-col")}>
        {updatedUsuarios && updatedUsuarios.length > 0 ? (
          updatedUsuarios.map((usuario, index) => (
            <ListCell
              key={usuario.id ?? index}
              usuario={usuario}
              conselho={conselho}
              tipo={tipo}
              toggleSelected={() => {
                toggleUsuario(usuario); 
                if (onSelect) onSelect(usuario); 
              }}
              setEditingUser={setEditingUser}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              copy
              isUserAlreadySelected={selecionados.some((u) => u.id === usuario.id)} 
              onClick={() => {
                if (tipo === "limpa" && onSelect) {
                  onSelect(usuario);
                }
              }}
              ativo={!!(tipo === "limpa" && usuarioSelecionado && usuarioSelecionado.id === usuario.id)}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            Nenhum usuário encontrado.
          </p>
        )}
      </ScrollArea>

      {tipo === "edit" && (
        <EditUserDialog
          usuario={editingUser!}
          isOpen={isDialogOpen}
          setOpen={setIsDialogOpen}
          onUpdate={handleUpdateUser}
        />
      )}
    </section>
  );
}