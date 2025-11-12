"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import { validateRequired } from "@/utils/formValidation";

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
  const [pagina, setPagina] = useState(0);
  const [camposErro, setCamposErro] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const salvo = localStorage.getItem("preconselho-formulario");
    if (salvo) {
      try {
        setFormulario(JSON.parse(salvo));
      } catch {
        console.error("Erro ao carregar dados salvos");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("preconselho-formulario", JSON.stringify(formulario));
  }, [formulario]);

  const handleChange = (campo: keyof CampoFormulario, valor: string) => {
    const novoFormulario = [...formulario];
    novoFormulario[pagina] = { ...novoFormulario[pagina], [campo]: valor };
    setFormulario(novoFormulario);

    setCamposErro((prev) => {
      const novoErro = { ...prev };
      delete novoErro[campo];
      return novoErro;
    });
  };

  const camposPreenchidos = (secao: CampoFormulario) => {
    return (
      secao.positivos.trim() !== "" &&
      secao.melhoria.trim() !== "" &&
      secao.sugestoes.trim() !== ""
    );
  };

  const handleNext = () => {
    const secaoAtual = formulario[pagina];
    const novosErros: { [key: string]: string } = {};

    novosErros.positivos = validateRequired(secaoAtual.positivos, "pontos positivos");
    novosErros.melhoria = validateRequired(secaoAtual.melhoria, "melhoria");
    novosErros.sugestoes = validateRequired(secaoAtual.sugestoes, "sugestões");

    if (Object.values(novosErros).some((erro) => erro)) {
      setCamposErro(novosErros);
      toast.error("Preencha todos os campos antes de continuar!");
      return;
    }

    setCamposErro({});
    setPagina(pagina + 1);
  };

  const handleSalvar = () => {
    const tudoPreenchido = formulario.every((secao) => camposPreenchidos(secao));
    if (!tudoPreenchido) {
      toast.error("Preencha todos os campos antes de enviar o formulário completo!");
      return;
    }

    toast.success("Pré-conselho salvo com sucesso!");
    localStorage.setItem("preconselho-formulario", JSON.stringify(formulario));
  };

  const secaoAtual = formulario[pagina];
  const estaCompleta = camposPreenchidos(secaoAtual);

  return (
    <div className="w-full max-w-[calc(100%-464px)] mx-auto py-8">
      {/*Transformar essa div em um componente*/}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Pré-Conselho</h1>
        <p className="mt-2 text-base font-bold text-gray-800 mb-4">
          05/10/2025 até 15/10/2025
        </p>
        <div className="border-b border-gray-200 my-2"></div>
        <p className="font-semibold text-lg text-foreground">{secaoAtual.titulo}</p>
        <p className="text-sm mt-0.5 text-muted-foreground">{secaoAtual.descricao}</p>
      </div>

      <div className="mt-11 pl-2 pr-4 space-y-6">
        <div>
          <Label className="text-[14px] leading-[20px] font-semibold text-foreground">
            Pontos positivos
          </Label>
          <Textarea
            placeholder="Insira aqui os pontos positivos..."
            className={`mt-2 resize-none bg-card ${
              camposErro.positivos ? "border border-red-500 focus-visible:ring-red-500" : ""
            }`}
            value={secaoAtual.positivos}
            onChange={(e) => handleChange("positivos", e.target.value)}
          />
          {camposErro.positivos && (
            <p className="text-sm text-red-500 mt-1">Este campo é obrigatório!</p>
          )}
        </div>

        <div>
          <Label className="text-[14px] leading-[20px] font-semibold text-foreground">
            Pontos de melhoria
          </Label>
          <Textarea
            placeholder="Insira aqui os pontos de melhoria..."
            className={`mt-2 resize-none bg-card ${
              camposErro.melhoria ? "border border-red-500 focus-visible:ring-red-500" : ""
            }`}
            value={secaoAtual.melhoria}
            onChange={(e) => handleChange("melhoria", e.target.value)}
          />
          {camposErro.melhoria && (
            <p className="text-sm text-red-500 mt-1">Este campo é obrigatório!</p>
          )}
        </div>

        <div>
          <Label className="text-[14px] leading-[20px] font-semibold text-foreground">
            Sugestões
          </Label>
          <Textarea
            placeholder="Insira aqui as sugestões..."
            className={`mt-2 resize-none bg-card ${
              camposErro.sugestoes ? "border border-red-500 focus-visible:ring-red-500" : ""
            }`}
            value={secaoAtual.sugestoes}
            onChange={(e) => handleChange("sugestoes", e.target.value)}
          />
          {camposErro.sugestoes && (
            <p className="text-sm text-red-500 mt-1">Este campo é obrigatório!</p>
          )}
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
            onClick={handleNext}
            className="text-[14px] leading-[20px] px-8"
          >
            Próximo
          </ButtonTT>
        ) : (
          <ButtonTT
            tooltip="Salvar"
            mode="default"
            onClick={() => {
              if (!estaCompleta) {
                handleNext();
                return;
              }
              setIsConfirmOpen(true);
            }}
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