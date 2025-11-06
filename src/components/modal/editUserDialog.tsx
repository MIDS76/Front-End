import { ACTIVE, Usuario } from "../../utils/types";
import { Combobox } from "../ui/combobox";
import { Input } from "../ui/input";
import ActionModal from "./actionModal";
import { useEffect, useState } from "react";
import usuariosLista from "@/data/usuarios.json";

interface EditUserDialogProps {
  usuario: Usuario;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: (updatedUsuario: Usuario) => void;
}

export default function EditUserDialog({
  usuario,
  isOpen,
  setOpen,
  onUpdate
}: EditUserDialogProps) {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [active, setActive] = useState(usuario.isActive ? "true" : "false");

  useEffect(() => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setActive(usuario.isActive ? "true" : "false");
  }, [usuario]);

  const handleUpdateUser = () => {
    const updatedUsuario = {
      ...usuario,
      nome,
      email,
      isActive: active === "true",
    };

    onUpdate(updatedUsuario);
    setOpen(false);
  }

  return (
    <ActionModal
      isOpen={isOpen}
      setOpen={setOpen}
      title="Editar Usuário"
      onClose={() => {
        setOpen(false);
      }}
      onConfirm={() => {
        handleUpdateUser();
      }}
      description=""
      conteudo={
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Nome"
            value={nome}
            className="w-full"
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Combobox
            items={ACTIVE}
            value={active}
            onChange={setActive}
            placeholder=""
            emptyMessage="Nenhuma opção encontrada"
            width="100%"
          />
        </div>
      }
    ></ActionModal>
  );
}