import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditUserDialog from "./modal/editUserDialog";
import { Conselho } from "@/utils/types";
import { Usuario } from "@/utils/types";
import { ListCell } from "./listcell";

interface ListaProps {
  className?: string;
  usuarios: Usuario[];
  tipo: "checkbox"
  | "edit"
  | "conselho"
  | "limpa";
  loading?: boolean;
  conselho?: Conselho;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Lista({
  className,
  usuarios,
  tipo,
  conselho,
  isDialogOpen,
  setIsDialogOpen
}: ListaProps) {
  const [selectedUsuarios, setSelectedUsuarios] = useState<Usuario[]>([]);
  const [editingUser, setEditingUser] = useState<Usuario>({} as Usuario);

  const toggleUsuario = (usuario: Usuario) => {
    setSelectedUsuarios((prev) =>
      prev.some((u) => u.id === usuario.id)
        ? prev.filter((u) => u.id !== usuario.id)
        : [...prev, usuario]
    );
  };

  return (
    <section className="flex flex-col items-stretch justify-start w-full gap-4 ">
      <ScrollArea className={cn(className, "flex flex-col")}>
        {usuarios?.map((usuario, index) => (
          <ListCell
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            key={index}
            usuario={usuario}
            conselho={conselho!}
            toggleSelected={() => toggleUsuario(usuario)}
            tipo={tipo}
            setEditingUser={setEditingUser}
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