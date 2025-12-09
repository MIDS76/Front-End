import React, { useState, useEffect, useRef } from "react";
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
  
  const [updatedUsuarios, setUpdatedUsuarios] = useState<Usuario[]>(usuarios || []);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const skipUpdateRef = useRef(false);

  useEffect(() => {
    if (skipUpdateRef.current) {
        skipUpdateRef.current = false;
        return;
    }

    if (usuarios) {
      setUpdatedUsuarios(usuarios);
    }
  }, [usuarios]); 

  const toggleUsuario = (usuario: Usuario) => {
    if (onSelect) onSelect(usuario); 
  };

  const handleUpdateUser = (updatedUsuario: Usuario) => {

    setUpdatedUsuarios((prevUsuarios) => {
      return prevUsuarios.map((usuario) => {
        if (String(usuario.id) === String(updatedUsuario.id)) {
            return updatedUsuario; 
        }
        return usuario; 
      });
    });

    setEditingUser(updatedUsuario);
        skipUpdateRef.current = true;

    setRefreshKey(old => old + 1);
    setIsDialogOpen(false); 
  };

  return (
    <section className="flex flex-col items-stretch justify-start w-full gap-4">
      <ScrollArea className={cn(className, "flex flex-col")}>
        {updatedUsuarios && updatedUsuarios.length > 0 ? (
          updatedUsuarios.map((usuario) => (
            <ListCell
              key={`${usuario.id}-${refreshKey}`} 
              usuario={usuario}
              conselho={conselho}
              tipo={tipo}
              toggleSelected={() => toggleUsuario(usuario)}
              setEditingUser={setEditingUser}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              copy
              isUserAlreadySelected={selecionados.some((u) => String(u.id) === String(usuario.id))} 
              onClick={() => {
                if (tipo === "limpa" && onSelect) {
                  onSelect(usuario);
                }
              }}
              ativo={!!(tipo === "limpa" && usuarioSelecionado && String(usuarioSelecionado.id) === String(usuario.id))}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            Nenhum usuário encontrado.
          </p>
        )}
      </ScrollArea>

      {tipo === "edit" && editingUser && (
        <EditUserDialog
          key={`modal-${editingUser.id}`}
          usuario={editingUser}
          isOpen={isDialogOpen}
          setOpen={setIsDialogOpen}
          onUpdate={handleUpdateUser} 
        />
      )}
    </section>
  );
}