import { ACTIVE, Usuario } from "../../utils/types";
import { Combobox } from "../ui/combobox";
import ActionModal from "./actionModal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TextField from "../input/textField";
import { Label } from "@radix-ui/react-dropdown-menu";
import { set } from "date-fns";
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
  const [active, setActive] = useState(usuario.isActive ? "true" : "false");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setActive(usuario.isActive ? "true" : "false");
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
    setActive(usuario.isActive ? "true" : "false");
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
      description=""
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
          <div className="flex flex-col gap-2 w-full">
            <Label
              className="whitespace-nowrap flex items-center font-semibold text-sm"
            >
              Status do Usuário
            </Label>
            <Combobox
              items={ACTIVE}
              value={active}
              onChange={setActive}
              placeholder="Selecione o status"
              emptyMessage="Nenhuma opção encontrada"
              width="100%"
              className={`${""} ${errors.active
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-gray-300 focus-visible:ring-gray-400"
                }`}
            />
            {errors.active && (
              <p className="text-red-500 text-sm mt-1">{errors.active}</p>
            )}
          </div>

        </div>
      }
    ></ActionModal>
  );
}