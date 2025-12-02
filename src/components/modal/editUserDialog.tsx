import { ACTIVE, Usuario } from "../../utils/types";
import { Combobox } from "../ui/combobox";
import ActionModal from "./actionModal";
import { useEffect, useState } from "react";
import TextField from "../input/textField";
import { showError, validateEmail, validateRequired } from "@/utils/formValidation";

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
  const [active, setActive] = useState(usuario.ativo ? "true" : "false");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setActive(usuario.ativo ? "true" : "false");
  }, [usuario]);

  const handleUpdateUser = () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    newErrors.nome = validateRequired(nome, "nome");
    newErrors.email = validateEmail(email);
    newErrors.active = validateRequired(active, "status do usuário");

    if (Object.values(newErrors).every((error) => error === "")) {
      const updatedUsuario = {
        ...usuario,
        nome,
        email,
        isActive: active === "true",
      };

      onUpdate(updatedUsuario);
      setOpen(false);
    } else {
      setErrors(newErrors);
      showError
    }
  }

  const handleCancel = () => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setActive(usuario.ativo ? "true" : "false");
    setErrors({});
    setOpen(false);
  };

  return (
    <ActionModal
      isOpen={isOpen}
      setOpen={setOpen}
      title="Editar Usuário"
      onClose={() => {
        handleCancel();
      }}
      onConfirm={() => {
        handleUpdateUser();
      }}

      conteudo={
        <div className="flex flex-col gap-2">
          <TextField
            value={nome}
            label="Nome"
            type="text"
            id="nomeUsuario"
            placeholder="nome"
            onChange={(e) => setNome(e.target.value)}
            error={errors.nome}
          />
          <TextField
            value={email}
            label="E-mail"
            type="text"
            id="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <div>
            <Combobox
              items={ACTIVE}
              value={active}
              onChange={setActive}
              placeholder="Selecione o status"
              emptyMessage="Nenhuma opção encontrada"
              width="100%"
              id="statusUsuario"
              label="Status do Usuário"
              error={errors.active}
            />
          </div>

        </div>
      }
    ></ActionModal>
  );
}