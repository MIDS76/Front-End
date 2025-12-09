import { ACTIVE, Usuario } from "../../utils/types";
import { Combobox } from "../ui/combobox";
import ActionModal from "./actionModal";
import { useEffect, useState } from "react";
import TextField from "../input/textField";
import { editarUsuario } from "@/api/usuarios";
import { showError, validateEmail, validateRequired } from "@/utils/formValidation";
import { DialogDescription } from "@radix-ui/react-dialog"; 

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

  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [active, setActive] = useState(usuario?.ativo ? "true" : "false");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setActive(usuario.ativo ? "true" : "false");
    }
  }, [usuario]);

  const handleUpdateUser = async () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    newErrors.nome = validateRequired(nome, "nome");
    newErrors.email = validateEmail(email);
    newErrors.active = validateRequired(active, "status do usuário");

    const hasErrors = Object.values(newErrors).some((error) => error && error.length > 0);

    if (!hasErrors) {
      setIsLoading(true);

      const roleParaUrl = "usuario"; 

      const updatedUsuario = {
        ...usuario,
        role: roleParaUrl,
        nome,
        email,
        ativo: active === "true",
      };

      try {
        await editarUsuario(updatedUsuario);
        
        onUpdate(updatedUsuario);

        setOpen(false);

      } catch (error: any) {
        console.error("ERRO:", error);
        if (error.response?.status === 403) {
             alert(`Erro 403. Permissão negada.`);
        } else {
             showError();
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
      showError();
    }
  }

  const handleCancel = () => {
    if(usuario) {
        setNome(usuario.nome);
        setEmail(usuario.email);
        setActive(usuario.ativo ? "true" : "false");
    }
    setErrors({});
    setOpen(false);
  };

  return (
    <ActionModal
      isOpen={isOpen}
      setOpen={setOpen}
      title="Editar Usuário"
      isLoading={isLoading} 
      onClose={() => { if (!isLoading) handleCancel(); }}
      onConfirm={handleUpdateUser}
      conteudo={
        <div className="flex flex-col gap-2">
          <div className="sr-only">
             <DialogDescription>Formulário de edição</DialogDescription>
          </div>
          <TextField
            value={nome}
            label="Nome"
            type="text"
            id="nomeUsuario"
            placeholder="Nome do usuário"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
            error={errors.nome}
            disabled={isLoading} 
          />
          <TextField
            value={email}
            label="E-mail"
            type="text"
            id="email"
            placeholder="Ex: exemplo@email.com"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading} 
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
              disabled={isLoading} 
            />
          </div>
        </div>
      }
    ></ActionModal>
  );
}