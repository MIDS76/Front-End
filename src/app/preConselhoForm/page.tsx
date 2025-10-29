"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";

type CampoFormulario = {
  titulo: string;
  descricao: string;
  positivos: string;
  melhoria: string;
  sugestoes: string;
};

const secoesIniciais: CampoFormulario[] = [
  {
    titulo: "Professor Kristian Erdmann",
    descricao:
      "Relacionado ao desempenho em sala, didática, relacionamento com os alunos e domínio da matéria.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Professor Vinícius Trindade",
    descricao:
      "Relacionado ao desempenho em sala, didática, relacionamento com os alunos e domínio da matéria.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Supervisão",
    descricao:
      "Avalie os aspectos relacionados à metodologia de ensino, domínio de conteúdo, clareza nas orientações, postura profissional e qualidade do acompanhamento oferecido pela supervisão",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Coordenadora Juciene",
    descricao:
      "Relacionado ao apoio à turma, acompanhamento pedagógico e comunicação com os docentes.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Secretaria Pedagógica",
    descricao:
      "Avalie os aspectos relacionados à organização acadêmica, eficiência no atendimento, clareza nas informações, disponibilidade para auxiliar e qualidade no suporte prestado pela Secretaria Pedagógica",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Ambiente de Ensino",
    descricao:
      "Avalie os aspectos relacionados à estrutura física e tecnológica, recursos disponíveis para as aulas, conforto, acessibilidade, segurança e adequação do ambiente ao processo de aprendizagem",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
];

export default function PreConselhoFormulario() {
  const [formulario, setFormulario] = useState<CampoFormulario[]>(secoesIniciais);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false); 
  const [pagina, setPagina] = useState(0);

  const handleChange = (campo: keyof CampoFormulario, valor: string) => {
    const novoFormulario = [...formulario];
    novoFormulario[pagina] = { ...novoFormulario[pagina], [campo]: valor };
    setFormulario(novoFormulario);
  };

  const handleSalvar = () => {
    toast.success("Pré-conselho salvo com sucesso!");
    localStorage.setItem("preconselho-formulario", JSON.stringify(formulario));
    setIsSuccessOpen(true); 
  };

  const secaoAtual = formulario[pagina];

  return (
    <div className="w-full max-w-[calc(100%-464px)] mx-auto py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Pré-Conselho</h1>
        <p className="mt-2 text-base font-bold text-gray-800 mb-4">05/10/2025 até 15/10/2025</p>
        <div className="border-b border-gray-200 my-2"></div>
        <p className="font-semibold text-lg text-foreground">{secaoAtual.titulo}</p>
        <p className="text-sm mt-0.5 text-muted-foreground">{secaoAtual.descricao}</p>
      </div>

      <div className="mt-11 pl-2 pr-4 mt-4 space-y-6">
        <div>
          <Label className="text-[14px] leading-[20px] font-semibold text-foreground">
            Pontos positivos
          </Label>
          <Textarea
            placeholder="Insira aqui os pontos positivos..."
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
            placeholder="Insira aqui os pontos de melhoria..."
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
            placeholder="Insira aqui as sugestões..."
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
            className="text-[14px] leading-[20px] bg-white text-black border border-gray-300 hover:bg-gray-100 px-8"
          >
            Anterior
          </ButtonTT>
        )}

        {pagina < formulario.length - 1 ? (
          <ButtonTT
            tooltip="Próximo"
            mode="default"
            onClick={() => setPagina(pagina + 1)}
            className="text-[14px] leading-[20px] px-8"
          >
            Próximo
          </ButtonTT>
        ) : (
          <ButtonTT
            tooltip="Salvar"
            mode="default"
            onClick={() => setIsConfirmOpen(true)}
            className="text-[14px] leading-[20px] px-8"
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
  );
}
