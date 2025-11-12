import { useEffect, useState } from "react";
import UserInfo from "./userInfo";
import UserActions from "./userActions";
import UserCheckbox from "./usercheckbox";
import { Conselho, Usuario } from "@/utils/types";
import AddButton from "../button/addButton";

interface ListCellProps {
  usuario?: Usuario;
  usuarioProfessor?: Usuario;
  copy?: boolean;
  children?: React.ReactNode;
  toggleSelected: (id: number | undefined) => void;
  tipo:
    | "checkbox"
    | "edit"
    | "add"
    | "star"
    | "excluir"
    | "conselho"
    | "limpa";
  onClick?: () => void;
  loading?: boolean;
  removeUser?: () => void;
  isUserAlreadySelected?: boolean;
  isStarred?: boolean;
  onStarClick?: () => void;
  onDelete?: (user: Usuario) => void;
  conselho?: Conselho;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingUser: React.Dispatch<React.SetStateAction<Usuario>>;
  ativo?: boolean;
}

export default function ListCell({
  usuario: user,
  copy,
  toggleSelected,
  tipo,
  isUserAlreadySelected,
  setIsDialogOpen,
  setEditingUser,
  onClick,
  ativo,
}: ListCellProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario>({} as Usuario);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setUsuario(user);
    }
  }, [user]);

  const baseClasses =
    "flex items-center justify-between py-2 px-3 rounded-md shadow mb-2 last:mb-0 transition-colors";
  const tipoClasses =
    tipo === "limpa"
      ? `cursor-pointer ${
          ativo
            ? "bg-[hsl(var(--primary)/0.15)] border border-[hsl(var(--primary))]"
            : "hover:bg-[hsl(var(--muted))] bg-card"
        }`
      : "bg-card";

  return (
    <li
      key={usuario?.id}
      className={`${baseClasses} ${tipoClasses}`}
      onClick={() => {
        if (tipo === "limpa" && onClick) {
          onClick();
        }
      }}
      role={tipo === "limpa" ? "button" : undefined}
      tabIndex={tipo === "limpa" ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && tipo === "limpa" && onClick) {
          onClick();
        }
      }}
    >
      <div className="flex flex-row items-center w-full">
        <UserInfo
          nome={usuario?.nome}
          email={usuario?.email}
          copy={copy}
          active={usuario.isActive}
        />
        <div className="text-sm text-muted-foreground inline-block">
          <p className={`${!usuario.isActive ? "text-gray-400" : ""}`}>
            {(usuario?.role ?? "").toLocaleUpperCase()}
          </p>
        </div>
      </div>

      {tipo === "edit" && (
        <UserActions
          usuario={usuario}
          isDropDownOpen={isDropDownOpen}
          setIsDropDownOpen={setIsDropDownOpen}
          setEditingUser={setEditingUser}
          setIsDialogOpen={setIsDialogOpen}
          isConfirmOpen={isConfirmOpen}
          setIsConfirmOpen={setIsConfirmOpen}
        />
      )}

      {tipo === "checkbox" && (
        <UserCheckbox usuario={usuario} toggleSelected={toggleSelected} />
      )}

      {tipo === "add" && (
        <AddButton
          isUserAlreadySelected={isUserAlreadySelected}
          onOpen={() => toggleSelected(usuario?.id)}
        />
      )}
    </li>
  );
}
