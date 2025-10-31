"use client";

import { useState, useEffect } from "react";
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

const avaliacaoAlunos: CampoFormulario[] = [
  {
    titulo: "Aluno 1",
    descricao:
      "Avalie o desempenho, postura e evolução do aluno, destacando pontos positivos, aspectos a melhorar e sugestões para o desenvolvimento individual.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Aluno 2",
    descricao:
      "Avalie o desempenho, postura e evolução do aluno, destacando pontos positivos, aspectos a melhorar e sugestões para o desenvolvimento individual.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Aluno 3",
    descricao:
      "Avalie o desempenho, postura e evolução do aluno, destacando pontos positivos, aspectos a melhorar e sugestões para o desenvolvimento individual.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
  {
    titulo: "Aluno 4",
    descricao:
      "Avalie o desempenho, postura e evolução do aluno, destacando pontos positivos, aspectos a melhorar e sugestões para o desenvolvimento individual.",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
];

const colorMap: Record<string, string> = {
  green: "#2B5E64",
  blue: "#2B3347",
  purple: "#462772",
  pink: "#8D2065",
  orange: "#825A2C",
};

export default function ConselhoCoordenacao() {
  const [formulario, setFormulario] = useState<CampoFormulario[]>(avaliacaoAlunos);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [primaryColor, setPrimaryColor] = useState<string>("green"); 

  useEffect(() => {
    const savedColor = localStorage.getItem("primaryColor");
    if (savedColor && colorMap[savedColor]) {
      setPrimaryColor(savedColor);
    }

    const handleColorChange = (event: Event) => {
      const newColor = (event as CustomEvent).detail;
      if (colorMap[newColor]) {
        setPrimaryColor(newColor);
      }
    };

    window.addEventListener("primaryColorChange", handleColorChange);

    return () => {
      window.removeEventListener("primaryColorChange", handleColorChange);
    };
  }, []);

  const handleChange = (campo: keyof CampoFormulario, valor: string) => {
    const novoFormulario = [...formulario];
    novoFormulario[pagina] = { ...novoFormulario[pagina], [campo]: valor };
    setFormulario(novoFormulario);
  };

  const handleSalvar = () => {
    toast.success("Conselho salvo com sucesso!");
    localStorage.setItem("conselho-formulario", JSON.stringify(formulario));
  };

  const secaoAtual = formulario[pagina];

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-8 transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div
          style={{ backgroundColor: colorMap[primaryColor] }}
          className="rounded-lg shadow p-6 w-full lg:w-[650px] flex flex-col gap-6 transition-colors duration-300"
        >
          <h2 className="text-2xl text-white font-h1">
            JGS - AI MIDS76 2024/1 INT1
          </h2>
          <h2 className="text-2xl text-white font-h1">WEG MI76</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6 w-full lg:w-[650px] flex flex-col gap-6">
          <div className="flex flex-row items-center gap-3 mt-2">
            <img
              src="/Artur.png"
              alt="Foto do aluno"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {secaoAtual.titulo}
              </h2>
              <p className="text-base font-bold text-gray-800">0000</p>
            </div>
          </div>

          <div className="mt-6 pl-2 pr-4 space-y-6">
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
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6 w-full max-w-[calc(650px*2+32px)]">
        {pagina > 0 && (
          <ButtonTT
            tooltip="Anterior"
            mode="default"
            onClick={() => setPagina(pagina - 1)}
            className="text-[14px] leading-[20px] bg-white text-black border border-gray-300 hover:bg-gray-100 w-36"
          >
            Anterior
          </ButtonTT>
        )}

        {pagina < formulario.length - 1 ? (
          <ButtonTT
            tooltip="Próximo"
            mode="default"
            onClick={() => setPagina(pagina + 1)}
            className="text-[14px] leading-[20px] w-36"
          >
            Próximo Passo
          </ButtonTT>
        ) : (
          <ButtonTT
            tooltip="Salvar"
            mode="default"
            onClick={() => setIsConfirmOpen(true)}
            className="text-[14px] leading-[20px] w-36"
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
