"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import Lista, { Usuario } from "@/components/lista";

type CampoFormulario = {
  titulo: string;
  cadastro: string;
  positivos: string;
  melhoria: string;
  sugestoes: string;
};

const avaliacaoAlunos: CampoFormulario[] = [
  { titulo: "Artur Neves Hopner", cadastro: "0001", positivos: "", melhoria: "", sugestoes: "" },
  { titulo: "Letícia Moretti", cadastro: "0002", positivos: "", melhoria: "", sugestoes: "" },
  { titulo: "Bruna Júlia Reckziegel", cadastro: "0003", positivos: "", melhoria: "", sugestoes: "" },
  { titulo: "Giulia Fugel", cadastro: "0004", positivos: "", melhoria: "", sugestoes: "" },
];

export default function ConselhoCoordenacao() {
  const router = useRouter(); 

  const [formulario, setFormulario] = useState<CampoFormulario[]>(() => {
    const salvo = localStorage.getItem("conselho-formulario");
    return salvo ? JSON.parse(salvo) : avaliacaoAlunos;
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");

  useEffect(() => {
    localStorage.setItem("conselho-formulario", JSON.stringify(formulario));
  }, [formulario]);

  const handleChange = (campo: keyof CampoFormulario, valor: string) => {
    const novoFormulario = [...formulario];
    novoFormulario[pagina] = { ...novoFormulario[pagina], [campo]: valor };
    setFormulario(novoFormulario);
  };

  const handleSalvar = () => {
    toast.success("Conselho salvo com sucesso!");
    localStorage.setItem("conselho-formulario", JSON.stringify(formulario));

    setTimeout(() => {
      router.push("/"); 
    }, 800); 
  };

  const secaoAtual = formulario[pagina];

  const camposPreenchidos =
    secaoAtual.positivos.trim() !== "" &&
    secaoAtual.melhoria.trim() !== "" &&
    secaoAtual.sugestoes.trim() !== "";

  const todosPreenchidos = formulario.every(
    (aluno) =>
      aluno.positivos.trim() !== "" &&
      aluno.melhoria.trim() !== "" &&
      aluno.sugestoes.trim() !== ""
  );

  return (
    <div className="w-full flex flex-col items-center px-8 py-8">
      <div className="flex w-full justify-center gap-8">
        <div className="flex flex-col w-full max-w-[750px] gap-2">
          <div className="bg-white rounded-lg shadow p-4 mb-2">
            <h5 className="text-3xl font-semibold text-foreground">JGS - AI MIDS 2024/1 INT1</h5>
            <div className="border-b border-gray-400 my-2"></div>
            <h5 className="text-3xl font-semibold text-foreground">WEG - MI 76</h5>
          </div>

          <input
            type="text"
            placeholder="Buscar um usuário"
            value={searchQueryUsuarios}
            onChange={(e) => setSearchQueryUsuarios(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#71A151] mb-2"
          />

          <div className="bg-gray-200 rounded-md shadow-inner w-full h-[377px] overflow-y-auto"></div>
        </div>

        <div className="flex flex-col items-end w-full max-w-[750px]">
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
                <p className="text-base font-medium text-gray-700">
                  Cadastro: {secaoAtual.cadastro}
                </p>
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

          <div className="flex justify-between items-center pt-6 w-full">
            <div className="flex gap-4">
              <ButtonTT
                tooltip="Anterior"
                mode="default"
                disabled={pagina === 0 || !camposPreenchidos}
                onClick={() => setPagina((prev) => Math.max(prev - 1, 0))}
                className={`text-[14px] leading-[20px] bg-white text-black border border-gray-300 hover:bg-gray-100 px-8 ${pagina === 0 || !camposPreenchidos ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Anterior
              </ButtonTT>

              <ButtonTT
                tooltip="Próximo"
                mode="default"
                disabled={pagina === formulario.length - 1 || !camposPreenchidos}
                onClick={() =>
                  setPagina((prev) => Math.min(prev + 1, formulario.length - 1))
                }
                className={`text-[14px] leading-[20px] bg-white text-black border border-gray-300 hover:bg-gray-100 px-8 ${pagina === formulario.length - 1 || !camposPreenchidos
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`}
              >
                Próximo
              </ButtonTT>
            </div>

            <ButtonTT
              tooltip="Próximo passo"
              mode="default"
              disabled={!todosPreenchidos}
              onClick={() => setIsConfirmOpen(true)}
              className={`text-[14px] leading-[20px] px-8 ${!todosPreenchidos ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              Próximo passo
            </ButtonTT>
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
