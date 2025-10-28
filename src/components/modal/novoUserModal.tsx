"use client";

import { useState } from "react";
import TextField from "../input/textField";
import ActionModalForm from "./actionModalForm";
import { toast } from "sonner";
import { Combobox } from "../ui/combobox";
import { USER_ROLES } from "@/utils/types";

// Importa a lista de usuários e turmas do JSON
import usuariosJson from "@/data/usuarios.json";
import turmasJson from "@/data/turma.json";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  turma?: string | null;
}

interface Turma {
  id: number;
  codigoTurma: string;
  nomeCurso: string;
}

interface NovoUserModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NovoUserModal({ isOpen, setOpen }: NovoUserModalProps) {
  const [tipoUsuario, setTipoUsuario] = useState<string>("");
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");

  const usuarios: Usuario[] = Object.values(usuariosJson);
  const turmas: Turma[] = Object.values(turmasJson);

  const handleSubmit = async (formData: FormData) => {
    const nome = (formData.get("nome") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const tipo = tipoUsuario;

    // 🔍 Validação básica
    if (!nome || !email || !tipo || (tipo.toLowerCase() === "aluno" && !turmaSelecionada)) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // 🔍 Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("E-mail inválido!");
      return;
    }

    // 🔍 Verifica se já existe usuário com email + tipo
    const duplicado = usuarios.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.role.toLowerCase() === tipo.toLowerCase()
    );
    if (duplicado) {
      toast.error("Já existe um usuário com este e-mail e tipo!");
      return;
    }

    // Gera senha aleatória
    const senhaGerada = Math.random().toString(36).slice(-8);

    // Simula requisição
    await new Promise((resolve) => setTimeout(resolve, 500));

    const novoUsuario: Usuario = {
      id: usuarios.length + 1,
      nome,
      email,
      role: tipo,
      turma: tipo.toLowerCase() === "aluno" ? turmaSelecionada : null,
    };

    console.log("Usuário cadastrado:", novoUsuario);

    toast.success(
      `Usuário ${nome} criado com sucesso! Senha gerada: ${senhaGerada}`
    );

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
          <TextField
            label="Nome"
            placeholder="Insira o nome do novo usuário"
            type="text"
            id="nome"
            name="nome"
            required
          />
          <TextField
            label="E-mail"
            placeholder="Insira o e-mail do novo usuário"
            type="email"
            id="email"
            name="email"
            required
          />
          <div>
            <label className="text-sm font-medium">
              Tipo de Usuário <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <Combobox
                items={USER_ROLES.map((r) => ({ value: r.value, label: r.label }))}
                value={tipoUsuario}
                onChange={(val) => {
                  setTipoUsuario(val);
                  setTurmaSelecionada(""); // limpa ao trocar tipo
                }}
                placeholder="Selecione um tipo de usuário..."
                emptyMessage="Nenhum tipo de usuário encontrado."
                width="100%"
              />
            </div>
          </div>

          {tipoUsuario.toLowerCase() === "aluno" && (
            <div>
              <label className="text-sm font-medium">
                Selecionar Turma <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <Combobox
                  items={turmas.map((t) => ({
                    value: t.codigoTurma,
                    label: `${t.codigoTurma} - ${t.nomeCurso}`,
                  }))}
                  value={turmaSelecionada}
                  onChange={setTurmaSelecionada}
                  placeholder="Selecione uma turma..."
                  emptyMessage="Nenhuma turma encontrada."
                  width="100%"
                />
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
