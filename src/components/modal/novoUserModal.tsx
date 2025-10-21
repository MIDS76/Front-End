import Form from "next/form";
import TextField from "../input/textField";
import ActionModal from "./actionModal";
import { toast } from "sonner";
import { Combobox } from "../ui/combobox";
import { useState } from "react";
import { USER_ROLES } from "@/utils/types";
interface NovoUserModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NovoUserModal({ isOpen, setOpen }: NovoUserModalProps) {
  const handleSubmit = async (formData: FormData) => {
    formData.append("tipo", value);
  };

  const [value, setValue] = useState<string>("");

  return (
    <ActionModal
      isOpen={isOpen}
      setOpen={setOpen}
      title="Novo Usuário"
      description="Insira as informações do novo usuário"
      onClose={() => setOpen(false)}
      onConfirm={() => {
        toast.success("Usuário criado com sucesso!");
        setTimeout(() => setOpen(false), 1000);
      }}
      conteudo={
        <>
          <div className="space-y-4 max-w-md mx-auto">
            <Form action={handleSubmit} className="flex flex-col gap-4">
              <div>
                <TextField
                  label="Nome"
                  placeholder="Insira o nome do novo usuário"
                  type="text"
                  id="nome"
                />
              </div>

              <div>
                <TextField
                  label="E-mail"
                  placeholder="Insira o e-mail do novo usuário"
                  type="email"
                  id="email"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tipo de Usuário
                </label>
                <div className="mt-2">
                  <Combobox
                    items={USER_ROLES}
                    value={value}
                    onChange={setValue}
                    placeholder="Selecione um tipo de usuário..."
                    emptyMessage="Nenhum tipo de usuário encontrado."
                    width="100%"
                  />
                </div>
              </div>
            </Form>
          </div>
        </>
      }
    ></ActionModal>
  );
}
