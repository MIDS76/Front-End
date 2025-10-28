"use client";

import { useState } from "react";
import TextField from "../input/textField";
import ActionModalForm from "./actionModalForm";
import { toast } from "sonner";
import { Combobox } from "../ui/combobox";
import { USER_ROLES } from "@/utils/types";

interface NovoUserModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NovoUserModal({ isOpen, setOpen }: NovoUserModalProps) {
  const [tipoUsuario, setTipoUsuario] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    const nome = (formData.get("nome") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const tipo = tipoUsuario;
    const turma = (formData.get("turma") as string)?.trim();

    // 🔍 Validação básica
    if (!nome || !email || !tipo) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return; // impede fechamento
    }

    // 🔍 Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("E-mail inválido!");
      return;
    }

    // Gera senha aleatória
    const senhaGerada = Math.random().toString(36).slice(-8);

    // Simula requisição (poderá substituir pela API real depois)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const novoUsuario = {
      nome,
      email,
      tipo,
      senha: senhaGerada,
      turma: tipo === "aluno" ? turma : null,
    };

    console.log("Usuário cadastrado:", novoUsuario);

    toast.success(
      `Usuário ${nome} criado com sucesso! Senha gerada: ${senhaGerada}`
    );

    // Fecha o modal somente se o cadastro for válido
    setTimeout(() => setOpen(false), 1200);
  };

  return (
    <ActionModalForm
      isOpen={isOpen}
      setOpen={setOpen}
      title="Novo Usuário"
      description="Insira as informações do novo usuário"
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit}
      actionButtonLabel="Confirmar"
      conteudo={
        <div className="space-y-4 max-w-md mx-auto mt-2">
          <div>
            <TextField
              label="Nome"
              placeholder="Insira o nome do novo usuário"
              type="text"
              id="nome"
              name="nome"
              required
            />
          </div>

          <div>
            <TextField
              label="E-mail"
              placeholder="Insira o e-mail do novo usuário"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Tipo de Usuário <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <Combobox
                items={USER_ROLES}
                value={tipoUsuario}
                onChange={setTipoUsuario}
                placeholder="Selecione um tipo de usuário..."
                emptyMessage="Nenhum tipo de usuário encontrado."
                width="100%"
              />
            </div>
          </div>

          {tipoUsuario === "aluno" && (
            <div>
              <TextField
                label="Turma"
                placeholder="Insira a turma do aluno"
                type="text"
                id="turma"
                name="turma"
                required
              />
            </div>
          )}
        </div>
      }
    />
  );
}
