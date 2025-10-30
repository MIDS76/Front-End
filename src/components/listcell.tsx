import api from "@/utils/axios";
import { useEffect, useState } from "react";
import ButtonTT from "./button/ButtonTT";
import ActionModal from "./modal/actionModal";
import { Textarea } from "./ui/textarea";
import UserInfo from "./userInfo";
import UserActions from "./userActions";
import UserCheckbox from "./usercheckbox";
import { Conselho, Usuario } from "@/utils/types";
import { UserConselho } from "./userConselho";
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
    removeUser: () => void;
    isUserAlreadySelected?: boolean;
    isStarred?: boolean;
    onStarClick?: () => void;
    onDelete?: (user: Usuario) => void;
    conselho?: Conselho;
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingUser: React.Dispatch<React.SetStateAction<Usuario>>;
}

export interface CampoConselho {
    id: number;
    pontosFortes: string;
    oportunidadesMelhoria: string;
    sugestoes: string;
    conselho: {
        id: number;
    };
    usuario: {
        id: number;
    };
    professor?: {
        id: number;
    };
    unidadeCurricular?: string;
}

export function ListCell({
    usuario: user,
    usuarioProfessor,
    copy,
    toggleSelected,
    tipo,
    removeUser,
    isUserAlreadySelected,
    conselho,
    isDialogOpen,
    setIsDialogOpen,
    setEditingUser,
}: ListCellProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [preenchido, setPreenchido] = useState(false);
    const [usuario, setUsuario] = useState<Usuario>({} as Usuario);
    const isAnyDialogOpen = isDialogOpen || isConfirmOpen || isFormModalOpen;
    const [campoForm, setCampoForm] = useState<CampoConselho | null>(null);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    useEffect(() => {
        if (campoForm)
            setPreenchido(
                campoForm?.pontosFortes.trim().length > 0 &&
                campoForm?.oportunidadesMelhoria.trim().length > 0 &&
                campoForm?.sugestoes.trim().length > 0
            );
    }, [campoForm]);

    const campo = {
        usuario: { id: user?.id ?? 0 + 1 },
        conselho: { id: conselho?.id },
        pontosFortes: "",
        oportunidadesMelhoria: "",
        sugestoes: "",
        unidadeCurricular: "java",
        professor: { id: usuarioProfessor?.id },
    };

    useEffect(() => {
        if (user) {
            setUsuario(user);
        }
    }, [user]);

    /*if (loading) {
        return (
            <li className="h-[60px] flex items-center justify-between py-2 px-3 rounded-md shadow-sm bg-card/70 animate-pulse mb-2 last:mb-0"></li>
        );
    }*/

    return (
        <li
            key={usuario?.id}
            className={`flex items-center justify-between py-2 px-3 rounded-md shadow bg-card mb-2 last:mb-0 
          ${tipo === "edit" ? "cursor-pointer" : ""}`}
            onClick={(e) => {/*
                if (tipo === "edit") {
                    if (isAnyDialogOpen) return;
                    e.stopPropagation();
                    setIsDialogOpen(false);
                    setIsDropDownOpen(false);

                    setTimeout(() => {
                        setEditingUser(usuario);
                        setIsDialogOpen(true);
                    }, 100);
                } else {
                    if (onClick) onClick();
                    toggleSelected(usuario?.id);
                }
            */}}
        >
            <UserInfo nome={usuario?.nome} email={usuario?.email} copy={copy} />

            {tipo === "edit" && (
                <UserActions
                    usuario={usuario}
                    isDropDownOpen={isDropDownOpen}
                    setIsDropDownOpen={setIsDropDownOpen}
                    setEditingUser={setEditingUser}
                    setIsDialogOpen={setIsDialogOpen}
                    isConfirmOpen={isConfirmOpen}
                    setIsConfirmOpen={setIsConfirmOpen}
                    removeUser={removeUser}
                />
            )}

            {tipo === "checkbox" && <UserCheckbox usuario={usuario} toggleSelected={toggleSelected} />}
            
            {tipo === "conselho" && campoForm && (
                <UserConselho
                    campoForm={campoForm}
                    setCampoForm={setCampoForm}
                    setIsDialogOpen={setIsDialogOpen}
                    setIsFormModalOpen={setIsFormModalOpen}
                    isFormModalOpen
                    usuario={usuario}
                    conselho={conselho!}
                    usuarioProfessor={usuarioProfessor}
                />
            )}

            {tipo === "add" && (
                <AddButton 
                    isUserAlreadySelected={isUserAlreadySelected}
                    onOpen={() => isDialogOpen}
                />
            )}

            {/*tipo === "excluir" && usuario?.role === "aluno" && (
                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div>
                                <ButtonTT
                                    tooltip="Remover da turma"
                                    mode="small"
                                    variant="ghost"
                                    icon="MoreVertical"
                                />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                                <Icon icon="BiSolidTrashAlt" /> Remover da turma
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <EditUserDialog
                        usuario={usuario!}
                        setUsuario={setUsuario}
                        isOpen={isDialogOpen}
                        setOpen={setIsDialogOpen}
                    />
                </div>
            )*/}
            {/*tipo === "conselho" && campoForm && (
                <>
                    <ButtonTT
                        tooltip="Fazer anotação"
                        variant="ghost"
                        icon="MdEditSquare"
                        mode="small"
                        className="text-secondary scale-75"
                        onClick={() => {
                            setIsFormModalOpen(true);
                            setIsDialogOpen(true);
                        }}
                    />
                    <ActionModal
                        customPosition={!usuarioProfessor}
                        removeBg
                        isOpen={isFormModalOpen}
                        setOpen={setIsFormModalOpen}
                        title={usuario.nome}
                        description={usuario.email}
                        actionButtonLabel="Salvar"
                        onConfirm={() => {
                            const campo: CampoConselho = {
                                id: campoForm?.id,
                                pontosFortes: !campoForm.pontosFortes
                                    ? " "
                                    : campoForm.pontosFortes.trim(),
                                oportunidadesMelhoria: !campoForm.oportunidadesMelhoria
                                    ? " "
                                    : campoForm.oportunidadesMelhoria.trim(),
                                sugestoes: !campoForm.sugestoes
                                    ? " "
                                    : campoForm.sugestoes.trim(),
                                conselho: { id: conselho?.id ?? 0 },
                                usuario: { id: usuario?.id ?? 0 },
                            };

                            if (usuarioProfessor) {
                                campo.professor = { id: usuarioProfessor?.id ?? 0 };
                                campo.unidadeCurricular = "java";
                                api.post(`formularios/criar/professor`, campo).then(() => { });
                            } else {
                                api.post(`formularios/criar/usuario`, campo).then(() => { });
                            }
                        }}
                        onClose={() => setIsDialogOpen(false)}
                        conteudo={
                            <div className="flex flex-col gap-4">
                                <Label>Insira os pontos fortes</Label>
                                <Textarea
                                    className="max-h-[200px]"
                                    placeholder={"Insira os pontos fortes"}
                                    value={campoForm.pontosFortes}
                                    onChange={(e) =>
                                        setCampoForm({ ...campoForm, pontosFortes: e.target.value })
                                    }
                                />
                                <Label>Insira as oportunidades de melhoria</Label>
                                <Textarea
                                    className="max-h-[200px]"
                                    placeholder={"Insira as oportunidades de melhoria"}
                                    value={campoForm.oportunidadesMelhoria}
                                    onChange={(e) =>
                                        setCampoForm({
                                            ...campoForm,
                                            oportunidadesMelhoria: e.target.value,
                                        })
                                    }
                                />
                                <Label>Insira as sugestões</Label>
                                <Textarea
                                    className="max-h-[200px]"
                                    placeholder={"Insira as sugestões"}
                                    value={campoForm.sugestoes}
                                    onChange={(e) =>
                                        setCampoForm({ ...campoForm, sugestoes: e.target.value })
                                    }
                                />
                            </div>
                        }
                    />
                </>
            )*/}
        </li>
    );
}