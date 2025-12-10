import Form from "next/form";
import TextField from "../input/textField";
import ActionModal from "./actionModal";
import { toast } from "sonner";
import { Combobox } from "../ui/combobox";
import { useEffect, useState } from "react";
import { USER_ROLES } from "@/utils/types";
import { hasErrors, showError, validateEmail, validateRequired } from "@/utils/formValidation";
import { criarUsuario } from "@/api/usuarios";
import { AxiosError } from "axios";
import ConfirmacaoNovoUser from "./confirmacaoNovoUser";

interface NovoUserModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NovoUserModal({ isOpen, setOpen }: NovoUserModalProps) {
  const [value, setValue] = useState<string>("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleOpenConfirm = () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    newErrors.nome = validateRequired(nome, "nome");
    newErrors.email = validateEmail(email);
    newErrors.tipo = validateRequired(value, "tipo de usuário");

    if (!hasErrors(newErrors)) {
      setConfirmOpen(true);
      console.log("abrir confirm");
    } else {
      setErrors(newErrors);
      showError();
      console.log(newErrors);
    }
  };

  const handleConfirm = async () => {
    try {
      // Tenta criar o usuário. Se falhar, Lança o erro.
      const novoUsuario = await criarUsuario({ nome: nome, email: email, role: value });

      // Se chegou aqui, a requisição foi bem-sucedida e novoUsuario não é nulo/undefined
      toast.success("Usuário criado com sucesso!");

      // Fechar o modal de confirmação
      setConfirmOpen(false);

      // Fechar o modal principal
      setOpen(false);

    } catch (error) {
      console.error("Erro ao criar o usuário:", error);
      let errorMessage = "Erro desconhecido ao tentar criar o usuário. Tente novamente.";

      if (error instanceof AxiosError) {
        if (error.response?.data) {
          errorMessage = error.response.data.message ||
            `Erro ${error.response.status}: Falha na requisição.`;
        } else {
          errorMessage = "Erro de conexão ou servidor indisponível.";
        }
      }

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setNome("");
        setEmail("");
        setValue("");
        setErrors({});
        setConfirmOpen(false);
      }, 200);
    }
  }, [isOpen]);

  return (
    <>
      <ActionModal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Novo Usuário"
        onClose={() => setOpen(false)}
        onConfirm={handleOpenConfirm}
        conteudo={
          <div className="space-y-4 max-w-md mx-auto">
            <Form action={() => { }} className="flex flex-col gap-4">
              <div>
                <TextField
                  label="Nome"
                  placeholder="Insira o nome do novo usuário"
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  error={errors.nome}
                />
              </div>

              <div>
                <TextField
                  label="E-mail"
                  placeholder="Insira o e-mail do novo usuário"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tipo de Usuário
                </label>
                <div className="mt-2">
                  <Combobox
                    id="tipo-usuario"
                    items={USER_ROLES}
                    value={value}
                    onChange={setValue}
                    placeholder="Selecione um tipo de usuário..."
                    emptyMessage="Nenhum tipo de usuário encontrado."
                    width="100%"
                    error={errors.tipo}
                  />
                </div>
              </div>
            </Form>
          </div>
        }
      />
      <ConfirmacaoNovoUser
        isOpen={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        title="Confirmar criação"
        message={`Deseja criar o usuário "${nome}" com o e-mail "${email}" e tipo "${value}"?`}
      />
    </>
  );
}