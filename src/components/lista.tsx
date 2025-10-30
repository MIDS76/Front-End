import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "./input/searchBar";
import ButtonTT from "./button/ButtonTT";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icon } from "./button/smallButton";
import EditUserDialog from "./modal/editUserDialog";
import api from "@/utils/axios";
import ActionModal from "./modal/actionModal";

import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Conselho } from "@/app/conselho/pagina";

import { Label } from "./ui/label";
import { useLocalStorage } from "usehooks-ts";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}

interface ListaProps {
  className?: string;
  usuarios: Usuario[];
  professor?: Usuario;
  tipo:
    | "chat"
    | "checkbox"
    | "edit"
    | "add"
    | "star"
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

  const [starredUsers, setStarredUsers] = useLocalStorage<number[]>(
    "starredUsers",
    []
  );

  const toggleUsuario = (usuario: Usuario) => {
    setSelectedUsuario((prev) => (prev?.id === usuario.id ? null : usuario));
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

  const handleStarClick = (user: Usuario) => {
    const isAlreadyStarred = starredUsers.includes(user.id);

    if (isAlreadyStarred) {
      const updated = starredUsers.filter((id) => id !== user.id);
      setStarredUsers(updated);
      localStorage.setItem("starredUsers", JSON.stringify(updated));
    } else {
      if (starredUsers.length >= 2) {
        return;
      }
      const updated = [...starredUsers, user.id];
      setStarredUsers(updated);
      localStorage.setItem("starredUsers", JSON.stringify(updated));
    }
  };
  const [editingUser, setEditingUser] = useState<Usuario>({} as Usuario);

  return (
    <section className="flex flex-col items-stretch justify-start w-full gap-4 ">
      <div className="flex items-center gap-2 px-4">
        <SearchBar
          placeholder="Buscar um usuário"
          searchQuery={searchQueryProp ? searchQueryProp : searchQuery}
          setSearchQuery={
            setSearchQueryProp ? setSearchQueryProp : setSearchQuery
          }
          filter={false}
          className="flex-1"
        />

        {(tipo === "excluir" || tipo === "star") && (
          <ButtonTT
            variant="secondary"
            onClick={() => console.log("Clicou em adicionar")}
            tooltip="Adicionar usuário"
            mode="default"
          >
            Adicionar
          </ButtonTT>
        )}
      </div>
      <ScrollArea className={cn(className, "flex flex-col items-stretch px-4")}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <ListCell
                tipo={tipo}
                toggleSelected={() => {}}
                selected={false}
                loading
                setEditingUser={() => {}}
                key={index}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            ))
          : filteredUsers?.map((usuario, index) => (
              <ListCell
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                usuarioProfessor={professor}
                loading={loading}
                key={index}
                usuario={usuario}
                conselho={conselho!}
                selected={selectedUsuario?.id === usuario.id}
                onClick={() => props.setSelectedContact(usuario)}
                toggleSelected={() => toggleUsuario(usuario)}
                tipo={tipo}
                isUserAlreadySelected={selectedUsers?.some(
                  (u) => u.id === usuario.id
                )}
                setEditingUser={setEditingUser}
                isStarred={starredUsers.includes(usuario.id)}
                onStarClick={() => handleStarClick(usuario)}
                removeUser={() => {
                  setFilteredUsers(
                    filteredUsers?.filter((user) => user.id !== usuario.id)
                  );
                }}
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

export function TextClickCopy({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const [show, setShow] = useState(false);

  return (
    <span className="flex flex-row items-center">
      <p
        onClick={() => {
          navigator.clipboard.writeText(String(children));
          toast.success("Texto copiado: " + String(children));
        }}
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className={cn(
          props.className,
          "cursor-pointer truncate text-muted-foreground"
        )}
      >
        {children}
      </p>
      <Copy
        className={`ml-1 inline max-h-3 max-w-3 ${
          show ? "text-inherit" : "text-transparent"
        }`}
      />
    </span>
  );
}

interface ListCellProps {
  usuario?: Usuario;
  usuarioProfessor?: Usuario;
  copy?: boolean;
  children?: React.ReactNode;
  selected?: boolean;
  toggleSelected: (id: number | undefined) => void;
  tipo:
    | "chat"
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
  selected,
  toggleSelected,
  tipo,
  onClick,
  loading,
  removeUser,
  isUserAlreadySelected,
  isStarred,
  onStarClick,
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
    api
      .put(
        `formularios/buscar/${usuarioProfessor ? "professor" : "usuario"}`,
        campo
      )
      .then((response) => {
        setCampoForm(response.data);
      })
      .catch(() => {
        setCampoForm(campo as CampoConselho);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setUsuario(user);
    }
  }, [user]);

  if (loading) {
    return (
      <li className="h-[60px] flex items-center justify-between py-2 px-3 rounded-md shadow-sm bg-card/70 animate-pulse mb-2 last:mb-0"></li>
    );
  }

  return (
    <li
      key={usuario?.id}
      className={`flex items-center justify-between py-2 px-3 rounded-md shadow bg-card mb-2 last:mb-0 
        ${tipo === "chat" || tipo === "edit" ? "cursor-pointer" : ""} 
        ${selected && tipo === "chat" ? "bg-secondary" : ""}`}
      onClick={(e) => {
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
      }}
    >
      <div className="flex gap-2 items-center w-1/2">
        <Avatar>
          <AvatarImage alt={usuario?.nome} />
          <AvatarFallback className="select-none">
            {usuario?.nome?.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <span
            className={`text-sm font-medium ${
              selected && tipo === "chat" ? "text-secondary-foreground" : ""
            }`}
          >
            {usuario?.nome}
          </span>
          {copy ? (
            <TextClickCopy className="text-sm">{usuario?.email}</TextClickCopy>
          ) : (
            <p
              className={`text-sm ${
                selected && tipo === "chat"
                  ? "text-accent"
                  : "text-muted-foreground"
              }`}
            >
              {usuario?.email}
            </p>
          )}
        </div>
      </div>

      {tipo === "edit" ||
        (tipo === "conselho" && campoForm && usuarioProfessor && (
          <div>
            <span
              className={cn(
                `text-sm font-bold`,
                tipo !== "conselho" || preenchido
                  ? "text-primary brightness-125 dark:brightness-200 "
                  : "text-destructive"
              )}
            >
              {tipo !== "conselho" && usuario?.role?.toUpperCase()}
              {tipo === "conselho" && preenchido ? "PREENCHIDO" : "PENDENTE"}
            </span>
          </div>
        ))}

      {tipo === "checkbox" && (
        <div className="flex items-center space-x-2 mr-2">
          {usuario?.nome === "Artur Neves Hopner" ? (
            <FaStar className="size-4 text-primary mr-2" />
          ) : (
            <div className="size-4" />
          )}
          <Checkbox
            id={`${usuario?.id}`}
            onCheckedChange={() => toggleSelected(usuario?.id)}
          />
        </div>
      )}

      {tipo === "edit" && (
        <div className="flex items-center space-x-2">
          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
            <DropdownMenuTrigger asChild>
              <div>
                <ButtonTT
                  tooltip="Opções"
                  mode="small"
                  variant="ghost"
                  icon="MoreVertical"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e: { stopPropagation: () => void }) => {
                  e.stopPropagation();
                  setIsDialogOpen(false);
                  setIsDropDownOpen(false);

                  setTimeout(() => {
                    setEditingUser(usuario);
                    setIsDialogOpen(true);
                  }, 100);
                }}
                className="cursor-pointer text-foreground"
              >
                <Icon icon="MdEditSquare" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={(e: { stopPropagation: () => void }) => {
                  e.stopPropagation();
                  setIsConfirmOpen(false);
                  setIsDropDownOpen(false);

                  setTimeout(() => {
                    setIsConfirmOpen(true);
                  }, 100);
                }}
              >
                <Icon icon="BiSolidTrashAlt" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ActionModal
            isOpen={isConfirmOpen}
            setOpen={setIsConfirmOpen}
            title="Excluir Usuário"
            description={
              "Tem certeza que deseja excluir o usuário " + usuario.nome + "?"
            }
            actionButtonLabel="Excluir"
            destructive
            onConfirm={() => {
              api.delete(`usuarios/deletar/${usuario?.id}`).then(removeUser);
            }}
          />
        </div>
      )}

      {tipo === "add" && !isUserAlreadySelected && (
        <ButtonTT
          tooltip="Adicionar"
          variant="ghost"
          icon="Plus"
          mode="small"
          className="text-secondary"
          onClick={() => setIsDialogOpen(true)}
        />
      )}

      {tipo === "star" && usuario?.role === "aluno" && (
        <div className="flex items-center space-x-2">
          <ButtonTT
            tooltip={
              isStarred ? "Remover representante" : "Promover a representante"
            }
            className="text-primary"
            variant="ghost"
            icon="Star"
            filled={isStarred}
            mode="small"
            onClick={(e) => {
              e.stopPropagation();
              if (onStarClick) onStarClick();
            }}
          />
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
      )}

      {tipo === "excluir" && usuario?.role === "aluno" && (
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
      )}
      {tipo === "conselho" && campoForm && (
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
                api.post(`formularios/criar/professor`, campo).then(() => {});
              } else {
                api.post(`formularios/criar/usuario`, campo).then(() => {});
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
      )}
    </li>
  );
}
