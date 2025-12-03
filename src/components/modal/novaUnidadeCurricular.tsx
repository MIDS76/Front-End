"use client";

import Form from "next/form";
import TextField from "../input/textField";
import ActionModal from "./actionModal";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { validateRequired } from "@/utils/formValidation";
import { criarUnidadeCurricular } from "@/api/preConselho";
import { ca } from "date-fns/locale";

interface NovaUnidadeCurricularProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NovaUnidadeCurricular({
  isOpen,
  setOpen,
}: NovaUnidadeCurricularProps) {
  const [nome, setNome] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};
    newErrors.nome = validateRequired(nome, "nome da Unidade Curricular");

    if (newErrors.nome) {
      setErrors(newErrors);
      return;
    }

    try{
      const uc = criarUnidadeCurricular(nome);
      console.log(uc);
      toast.success("Unidade Curricular criada com sucesso!");
    }catch(err){
      toast.error("Erro ao criar Unidade Curricular.");
      return;
    }

    setTimeout(() => {
      setOpen(false);
      setNome("");
      setErrors({});
    }, 200);
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setNome("");
        setErrors({});
      }, 200);
    }
  }, [isOpen]);

  return (
    <ActionModal
      isOpen={isOpen}
      setOpen={setOpen}
      title="Nova Unidade Curricular"
      onClose={() => setOpen(false)}
      onConfirm={handleConfirm}
      conteudo={
        <div className="space-y-4 max-w-md mx-auto">
          <Form action={() => {}} className="flex flex-col gap-4">
            <TextField
              label="Nome"
              placeholder="Insira o nome da nova Unidade Curricular"
              type="text"
              id="nomeUC"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              error={errors.nome} 
            />
          </Form>
        </div>
      }
    />
  );
}
