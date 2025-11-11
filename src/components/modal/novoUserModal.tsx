"use client";

import Form from "next/form";
import TextField from "../input/textField";
import ActionModal from "./actionModal";
import ConfirmacaoNovoUser from "./confirmacaoNovoUser";
import { toast } from "sonner";
import { Combobox } from "../ui/combobox";
import { useState, useEffect } from "react";
import { USER_ROLES } from "@/utils/types";
import { showError, validateEmail, validateRequired } from "@/utils/formValidation";

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

    if (Object.keys(newErrors).length === 0) {
      setConfirmOpen(true);
    }else{
      setErrors(newErrors);
      showError
    }
  };

  const handleConfirm = () => {
    toast.success("Usuário criado com sucesso!");
    setConfirmOpen(false);
    setTimeout(() => {
      setOpen(false);
     
      setNome("");
      setEmail("");
      setValue("");
      setErrors({});
    }, 300);
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
        description="Insira as informações do novo usuário"
        onClose={() => setOpen(false)}
        onConfirm={handleOpenConfirm}
        conteudo={
          <div className="space-y-4 max-w-md mx-auto">
            <Form action={() => {}} className="flex flex-col gap-4">
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
                <div>
                  <Combobox
                    items={USER_ROLES}
                    value={value}
                    onChange={setValue}
                    placeholder="Selecione um tipo de usuário..."
                    emptyMessage="Nenhum tipo de usuário encontrado."
                    width="100%"
                    id="tipoUsuario"
                    label="Tipo de Usuário"
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
