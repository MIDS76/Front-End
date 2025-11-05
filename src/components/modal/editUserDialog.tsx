import { ACTIVE, Usuario } from "../../utils/types";
import { Combobox } from "../ui/combobox";
import { Input } from "../ui/input";
import ActionModal from "./actionModal";
import { useEffect, useState } from "react";

interface EditUserDialogProps {
  usuario: Usuario;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario>>;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditUserDialog({
  usuario,
  setUsuario,
  isOpen,
  setOpen,
}: EditUserDialogProps) {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [active, setActive] = useState(usuario.isActive ? "true" : "false");

  useEffect(() => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setActive(usuario.isActive ? "true" : "false");
  }, [usuario]);

  return (
    <ActionModal
      isOpen={isOpen}
      setOpen={setOpen}
      title="Editar Usuário"
      onClose={() => {
        setOpen(false);
      }}
      onConfirm={() => {
        setUsuario({
          ...usuario,
          nome,
          email
        });
        setOpen(false);
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
            placeholder="Selecione o status do usuário"
            emptyMessage="Nenhuma opção encontrada"
            width="100%"
          />
        </div>
      }
    ></ActionModal>
  );
}