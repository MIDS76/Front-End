"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";

type CampoFormulario = {
  titulo: string;
  positivos: string;
  melhoria: string;
  sugestoes: string;
};

const avaliacaoAlunos: CampoFormulario[] = [
  { titulo: "Aluno 1", positivos: "", melhoria: "", sugestoes: "" },
  { titulo: "Aluno 2", positivos: "", melhoria: "", sugestoes: "" },
  { titulo: "Aluno 3", positivos: "", melhoria: "", sugestoes: "" },
  { titulo: "Aluno 4", positivos: "", melhoria: "", sugestoes: "" },
];

export default function ConselhoCoordenacao() {
  const [formulario, setFormulario] = useState<CampoFormulario[]>(avaliacaoAlunos);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");

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
    <div className="w-full h-screen flex flex-col items-center px-8 py-8">
      <div className="flex w-full justify-center gap-8">
        <div className="flex flex-col w-full max-w-[650px] gap-2">
          <div className="rounded-lg shadow p-4 w-full bg-[#2B5E64] flex flex-col gap-1">
            <h2 className="text-lg text-white font-semibold">JGS - AI MIDS 2024/1 INT1</h2>
            <h2 className="text-lg text-white font-semibold">WEG - MI 76</h2>
          </div>

          <input
            type="text"
            placeholder="Buscar um usuário"
            value={searchQueryUsuarios}
            onChange={(e) => setSearchQueryUsuarios(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#71A151]"
          />

          <div className="bg-gray-100 rounded-md shadow-inner w-full h-[420px] overflow-y-auto"></div>
        </div>

        <div className="flex flex-col items-end w-full max-w-[650px]">
          <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col gap-6">
            <div className="flex flex-row items-center gap-3 mt-2">
              <img
                src="/Artur.png"
                alt="Foto do aluno"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {secaoAtual.titulo}
                </h2>
                <p className="text-base font-medium text-gray-700"></p>
              </div>
            </div>

            <div className="mt-6 pl-2 pr-4 space-y-6">
              <div>
                <Label className="text-sm font-semibold text-foreground">
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
                <Label className="text-sm font-semibold text-foreground">
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
                <Label className="text-sm font-semibold text-foreground">
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

          <div className="mt-4">
            {pagina < formulario.length - 1 ? (
              <ButtonTT
                tooltip="Próximo"
                mode="default"
                onClick={() => setPagina(pagina + 1)}
                className="text-sm leading-[20px] w-40"
              >
                Próximo passo
              </ButtonTT>
            ) : (
              <ButtonTT
                tooltip="Salvar"
                mode="default"
                onClick={() => setIsConfirmOpen(true)}
                className="text-sm leading-[20px] w-40"
              >
                Enviar
              </ButtonTT>
            )}
          </div>
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
        }}
      />
    </div>
  );
}