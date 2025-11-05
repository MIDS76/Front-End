import { useEffect, useState } from "react";
import UserInfo from "./userInfo";
import UserActions from "./userActions";
import UserCheckbox from "./usercheckbox";
import { Conselho, Usuario } from "@/utils/types";
import { CampoConselho, UserConselho } from "./userConselho";
import AddButton from "./button/addButton";

interface ListCellProps {
    usuario?: Usuario;
    usuarioProfessor?: Usuario;
    copy?: boolean;
    children?: React.ReactNode;
    toggleSelected: (id: number | undefined) => void;
    tipo: "checkbox"
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
}

export function ListCell({
    usuario: user,
    copy,
    toggleSelected,
    tipo,
    isUserAlreadySelected,
    setIsDialogOpen,
    setEditingUser,
}: ListCellProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [usuario, setUsuario] = useState<Usuario>({} as Usuario);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setUsuario(user);
        }
    }, [user]);

    return (
        <li
            key={usuario?.id}
            className={`flex items-center justify-between py-2 px-3 rounded-md shadow bg-card mb-2 last:mb-0 
          ${tipo === "edit" ? "cursor-pointer" : ""}`}
            onClick={(e) => { }}
        >
            <div className="flex flex-row items-center w-full">
                <UserInfo nome={usuario?.nome} email={usuario?.email} copy={copy} />

                <div className="text-sm text-muted-foreground inline-block">
                    <p>{(usuario?.role ?? "").toLocaleUpperCase()}</p>
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

            {tipo === "checkbox" && <UserCheckbox usuario={usuario} toggleSelected={toggleSelected} />}

            {tipo === "add" && (
                <AddButton
                    isUserAlreadySelected={isUserAlreadySelected}
                    onOpen={() => toggleSelected(usuario?.id)}
                />
            )}
        </li>
    );
}