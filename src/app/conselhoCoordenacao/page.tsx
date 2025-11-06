"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import { Usuario } from "@/utils/types";
import usuariosData from "@/data/usuarios.json";

type CampoFormulario = {
  titulo: string;
  positivos: string;
  melhoria: string;
  sugestoes: string;
};

export default function ConselhoCoordenacao() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formulario, setFormulario] = useState<CampoFormulario[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [errosCampos, setErrosCampos] = useState({
    positivos: false,
    melhoria: false,
    sugestoes: false,
  });

  useEffect(() => {
    const alunos = usuariosData.filter((u) => u.role === "Aluno");
    setUsuarios(alunos);

    const salvoRaw = localStorage.getItem("conselho-formulario");
    if (!salvoRaw) {
      const inicial = alunos.map((aluno) => ({
        titulo: aluno.nome,
        positivos: "",
        melhoria: "",
        sugestoes: "",
      }));
      setFormulario(inicial);
      return;
    }

    try {
      const salvo: CampoFormulario[] = JSON.parse(salvoRaw);
      const alinhado = alunos.map((aluno) => {
        const achado = salvo.find((s) => s.titulo === aluno.nome);
        return (
          achado ?? {
            titulo: aluno.nome,
            positivos: "",
            melhoria: "",
            sugestoes: "",
          }
        );
      });
      setFormulario(alinhado);
      localStorage.setItem("conselho-formulario", JSON.stringify(alinhado));
    } catch {
      const inicial = alunos.map((aluno) => ({
        titulo: aluno.nome,
        positivos: "",
        melhoria: "",
        sugestoes: "",
      }));
      setFormulario(inicial);
      localStorage.setItem("conselho-formulario", JSON.stringify(inicial));
    }
  }, []);

  useEffect(() => {
    if (formulario.length > 0) {
      localStorage.setItem("conselho-formulario", JSON.stringify(formulario));
    }
  }, [formulario]);

  const handleChange = (campo: keyof CampoFormulario, valor: string) => {
    const novoFormulario = [...formulario];
    novoFormulario[pagina] = { ...novoFormulario[pagina], [campo]: valor };
    setFormulario(novoFormulario);
    setErrosCampos((prev) => ({ ...prev, [campo]: false }));
  };

  const validarCampos = () => {
    const secaoAtual = formulario[pagina];
    const erros = {
      positivos: secaoAtual.positivos.trim() === "",
      melhoria: secaoAtual.melhoria.trim() === "",
      sugestoes: secaoAtual.sugestoes.trim() === "",
    };
    setErrosCampos(erros);

    if (erros.positivos || erros.melhoria || erros.sugestoes) {
      toast.error("Preencha todos os campos antes de continuar!");
      return false;
    }
    return true;
  };

  const trocarPagina = (novaPagina: number) => {
    if (!validarCampos()) return;
    setPagina(novaPagina);
    setUsuarioSelecionado(usuarios[novaPagina]);
  };

  const trocarAluno = (aluno: Usuario, index: number) => {
    if (!validarCampos()) return;
    setPagina(index);
    setUsuarioSelecionado(aluno);
  };

  const handleSalvar = () => {
    if (!validarCampos()) return;

    toast.success("Conselho salvo com sucesso!");
    localStorage.setItem("conselho-formulario", JSON.stringify(formulario));
    setTimeout(() => router.push("/"), 800);
  };

  const alunosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(searchQueryUsuarios.toLowerCase())
  );

  const secaoAtual = usuarioSelecionado
    ? formulario.find((f) => f.titulo === usuarioSelecionado.nome) ?? {
        titulo: "",
        positivos: "",
        melhoria: "",
        sugestoes: "",
      }
    : formulario[pagina] ?? {
        titulo: "",
        positivos: "",
        melhoria: "",
        sugestoes: "",
      };

  const todosPreenchidos = formulario.every(
    (f) => f.positivos.trim() && f.melhoria.trim() && f.sugestoes.trim()
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

          <div className="bg-gray-100 rounded-md shadow-inner w-full h-[377px] overflow-y-auto p-1">
            {alunosFiltrados.map((aluno) => {
              const index = formulario.findIndex((f) => f.titulo === aluno.nome);
              return (
                <button
                  key={aluno.id}
                  onClick={() => trocarAluno(aluno, index)}
                  className={`flex items-center gap-3 w-full p-3 my-1 rounded-md text-left bg-white border border-gray-200 shadow-sm hover:shadow-md transition ${
                    secaoAtual.titulo === aluno.nome ? "bg-gray-50 border-gray-300" : ""
                  }`}
                >
                  <img
                    src={`/${aluno.nome.split(" ")[0]}.png`}
                    alt={aluno.nome}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{aluno.nome}</h4>
                    <p className="text-sm text-gray-600">{aluno.email}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-end w-full max-w-[750px]">
          <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col gap-6">
            <div className="flex flex-row items-center gap-3 mt-2">
              <img
                src={`/${usuarioSelecionado?.nome.split(" ")[0] || "default"}.png`}
                alt={usuarioSelecionado?.nome || "Foto do aluno"}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {secaoAtual.titulo || "Selecione um aluno"}
                </h2>
              </div>
            </div>

            <div className="mt-6 pl-2 pr-4 space-y-6">
              <div>
                <Label className="text-sm font-semibold text-foreground">Pontos positivos</Label>
                <Textarea
                  placeholder="Insira aqui os pontos positivos..."
                  className={`mt-2 resize-none bg-card ${
                    errosCampos.positivos ? "border-2 border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  value={secaoAtual.positivos}
                  onChange={(e) => handleChange("positivos", e.target.value)}
                />
                {errosCampos.positivos && (
                  <p className="text-sm text-red-500 mt-1">Este campo é obrigatório!</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground">Pontos de melhoria</Label>
                <Textarea
                  placeholder="Insira aqui os pontos de melhoria..."
                  className={`mt-2 resize-none bg-card ${
                    errosCampos.melhoria ? "border-2 border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  value={secaoAtual.melhoria}
                  onChange={(e) => handleChange("melhoria", e.target.value)}
                />
                {errosCampos.melhoria && (
                  <p className="text-sm text-red-500 mt-1">Este campo é obrigatório!</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground">Sugestões</Label>
                <Textarea
                  placeholder="Insira aqui as sugestões..."
                  className={`mt-2 resize-none bg-card ${
                    errosCampos.sugestoes ? "border-2 border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  value={secaoAtual.sugestoes}
                  onChange={(e) => handleChange("sugestoes", e.target.value)}
                />
                {errosCampos.sugestoes && (
                  <p className="text-sm text-red-500 mt-1">Este campo é obrigatório!</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 w-full">
            <div className="flex gap-4">
              <ButtonTT
                tooltip="Anterior"
                mode="default"
                onClick={() => trocarPagina(pagina - 1)}
                disabled={pagina === 0}
                className={`text-[14px] leading-[20px] bg-white text-black border border-gray-300 hover:bg-gray-100 px-8 ${
                  pagina === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Anterior
              </ButtonTT>

              <ButtonTT
                tooltip="Próximo"
                mode="default"
                onClick={() => trocarPagina(pagina + 1)}
                disabled={pagina === formulario.length - 1}
                className={`text-[14px] leading-[20px] bg-white text-black border border-gray-300 hover:bg-gray-100 px-8 ${
                  pagina === formulario.length - 1 ? "opacity-50 cursor-not-allowed" : ""
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
              className={`text-[14px] leading-[20px] px-8 ${
                !todosPreenchidos ? "opacity-50 cursor-not-allowed" : ""
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
