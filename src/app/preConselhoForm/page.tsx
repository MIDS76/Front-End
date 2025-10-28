"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    descricao:
      "Relacionado à metodologia e ensino, domínio do conteúdo.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Professor Kristian",
    descricao:
      "Relacionado ao desempenho em sala, didática, relacionamento com os alunos e domínio da matéria.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Professor Vinícius",
    descricao:
      "Relacionado ao desempenho em sala, didática, relacionamento com os alunos e domínio da matéria.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Coordenadora Jusciene",
    descricao:
      "Relacionado ao apoio à turma, acompanhamento pedagógico e comunicação com os docentes.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
];

export default function PreConselhoFormulario() {
  const [formulario, setFormulario] =
    useState<CampoFormulario[]>(secoesIniciais);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pagina, setPagina] = useState(0);

  const handleChange = (
    campo: keyof CampoFormulario,
    valor: string
  ) => {
    const novoFormulario = [...formulario];
    novoFormulario[pagina] = {
      ...novoFormulario[pagina],
      [campo]: valor,
    };
    setFormulario(novoFormulario);
  };

  const handleSalvar = () => {
    toast.success("Pré-conselho salvo com sucesso!");
    localStorage.setItem("preconselho-formulario", JSON.stringify(formulario));
    setTimeout(() => open("/", "_self"), 1000);
  };

  const handleCancelar = () => {
    setFormulario(secoesIniciais);
    localStorage.removeItem("preconselho-formulario");
  };

  const secaoAtual = formulario[pagina];

  return (
    <ScrollArea className="h-5/6 w-full lg:m-8 px-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pré-conselho</h1>
        <p className="text-sm text-muted-foreground mb-6">
          05/10/2025 à 15/10/2025
        </p>

        <div>
          <p className="font-semibold text-lg text-foreground">
            {secaoAtual.titulo}
          </p>
          <p className="text-sm mt-0.5 text-muted-foreground">
            {secaoAtual.descricao}
          </p>
        </div>

        <div className="pl-2 pr-4 mt-4 space-y-6">
          <div>
            <Label className="text-[14px] leading-[20px] font-semibold text-foreground">
              Pontos positivos
            </Label>
            <Textarea
              placeholder="Insira aqui os pontos positivos do docente..."
              className="mt-2 resize-none bg-card"
              value={secaoAtual.positivos}
              onChange={(e) => handleChange("positivos", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-[14px] leading-[20px] font-semibold text-foreground">
              Pontos de melhoria
            </Label>
            <Textarea
              placeholder="Insira aqui os pontos de melhoria do docente..."
              className="mt-2 resize-none bg-card"
              value={secaoAtual.melhoria}
              onChange={(e) => handleChange("melhoria", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-[14px] leading-[20px] font-semibold text-foreground">
              Sugestões
            </Label>
            <Textarea
              placeholder="Insira aqui as sugestões para o docente..."
              className="mt-2 resize-none bg-card"
              value={secaoAtual.sugestoes}
              onChange={(e) => handleChange("sugestoes", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-8 gap-4 mr-4">
          {pagina > 0 && (
            <ButtonTT
              tooltip="Anterior"
              mode="default"
              onClick={() => setPagina(pagina - 1)}
              className="text-[14px] leading-[20px]"
            >
              Anterior
            </ButtonTT>
          )}

          {pagina < formulario.length - 1 ? (
            <ButtonTT
              tooltip="Próximo"
              mode="default"
              onClick={() => setPagina(pagina + 1)}
              className="text-[14px] leading-[20px]"
            >
              Próximo
            </ButtonTT>
          ) : (
            <ButtonTT
              tooltip="Salvar"
              mode="default"
              onClick={() => setIsConfirmOpen(true)}
              className="text-[14px] leading-[20px]"
            >
              Enviar
            </ButtonTT>
          )}
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
          }}
        />
      </div>
    </ScrollArea>
  );
}
