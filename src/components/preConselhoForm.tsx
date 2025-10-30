"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";
import ButtonTT from "./button/ButtonTT";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

type CampoFormulario = {
  titulo: string;
  descricao: string;
  positivos: string;
  melhoria: string;
  sugestoes: string;
};

const secoesIniciais: CampoFormulario[] = [
  {
    titulo: "Supervisão",
    descricao: "Relacionado à metodologia e ensino, domínio do conteúdo...",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Secretaria Pedagógica",
    descricao: "Relacionado à metodologia e ensino, domínio do conteúdo...",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Ambiente de ensino",
    descricao: "Relacionado à metodologia e ensino, domínio do conteúdo...",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Docente: Kristian Erdmann",
    descricao: "Relacionado à metodologia e ensino, domínio do conteúdo...",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
];

export default function PreConselhoFormulario() {
  const [formulario, setFormulario] =
    useState<CampoFormulario[]>(secoesIniciais);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("preconselho-formulario");
    if (dadosSalvos) {
      setFormulario(JSON.parse(dadosSalvos));
    }
  }, []);

  const handleChange = (
    index: number,
    campo: keyof CampoFormulario,
    valor: string
  ) => {
    const novoFormulario = [...formulario];
    novoFormulario[index] = {
      ...novoFormulario[index],
      [campo]: valor,
    };
    setFormulario(novoFormulario);
  };

  const handleSalvar = () => {
    toast.success("Pré conselho salvo com sucesso!");
    localStorage.setItem("preconselho-formulario", JSON.stringify(formulario));
    setTimeout(() => open("/", "_self"), 1000);
  };

  const handleCancelar = () => {
    setFormulario(secoesIniciais);
    localStorage.removeItem("preconselho-formulario");
  };

  return (
    <ScrollArea className="h-5/6 w-full lg:m-8 px-8">
      <div>
        {formulario.map((secao, index) => (
          <div key={index} className="mb-4 space-y-6">
            <div>
              <p className="font-semibold text-lg text-foreground">
                {secao.titulo}
              </p>
              <p className="text-sm mt-.5 text-muted-foreground">
                {secao.descricao}
              </p>
            </div>
            <div className="pl-2 pr-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i}>
                  <Label
                    htmlFor={`positivos-${index}`}
                    className="text-[14px] leading-[20px] font-semibold text-foreground"
                  >
                    {i === 0
                      ? "Pontos positivos"
                      : i === 1
                      ? "Pontos de melhoria"
                      : "Sugestões"}
                  </Label>
                  <Textarea
                    id={`positivos-${index}`}
                    placeholder="Escreva aqui o que for debatido com a turma sobre o tópico."
                    className="mt-2 resize-none bg-card"
                    value={secao.positivos}
                    onChange={(e) =>
                      handleChange(index, "positivos", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-8 gap-4 mr-4">
          <ButtonTT
            tooltip="Cancelar"
            variant="destructive"
            mode="default"
            onClick={handleCancelar}
            className="text-[14px] leading-[20px]"
          >
            Cancelar
          </ButtonTT>

          <ButtonTT
            tooltip="Salvar"
            mode="default"
            onClick={() => setIsConfirmOpen(true)}
            className="text-[14px] leading-[20px]"
          >
            Enviar
          </ButtonTT>
        </div>
      </div>

      <ActionModal
        isOpen={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        title="Salvar resposta"
        description="Deseja salvar essa resposta de conselho?"
        actionButtonLabel="Salvar"
        onConfirm={() => {
          handleSalvar();
          setIsConfirmOpen(false);
          window.location.href = "/";
        }}
      />
    </ScrollArea>
  );
}
