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
import Lista from "@/components/lista";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserInfo from "@/components/userInfo";


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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const alunos = usuariosData.filter((u) => u.role === "Aluno" && u.isActive === true);
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

  const alunosFiltrados = usuarios.filter(
    (usuario) => usuario.isActive && usuario.nome.toLowerCase().includes(searchQueryUsuarios.toLowerCase())
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
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden px-[2rem]">
      <div className="flex w-full justify-center gap-[2rem]">
        <div className="flex flex-col w-full max-w-[46.875rem] gap-[0.5rem]">
          <div className="bg-white rounded-[0.5rem] shadow p-[1rem] mb-[1rem]">
            <h5 className="text-[1.875rem] font-semibold text-foreground">JGS - AI MIDS 2024/1 INT1</h5>
            <div className="border-b border-gray-400 my-[0.5rem]"></div>
            <h5 className="text-[1.875rem] font-semibold text-foreground">WEG - MI 76</h5>
          </div>

          <input
            type="text"
            placeholder="Buscar um usuário"
            value={searchQueryUsuarios}
            onChange={(e) => setSearchQueryUsuarios(e.target.value)}
            className="w-full rounded-[0.375rem] border border-gray-300 bg-white px-[0.75rem] py-[0.5rem] text-[0.875rem] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#71A151] mb-[1rem]"
          />

          <div
            className="w-full h-[23.5625rem] rounded-xl p-[0.75rem] shadow-inner border border-gray-300"
            style={{ backgroundColor: "hsl(0, 0%, 94.51%)" }}
          >
            <ScrollArea className="h-full w-full pr-2">
              <div className="space-y-[0.75rem]">
                {alunosFiltrados.map((usuario, index) => (
                  <div
                    key={index}
                    onClick={() => trocarAluno(usuario, index)}
                    className="cursor-pointer bg-white hover:bg-gray-100 transition-all rounded-lg shadow p-[0.75rem] border border-gray-200"
                  >
                    <UserInfo
                      nome={usuario.nome}
                      email={usuario.email}
                      copy={false}
                      active={usuario.isActive}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>


        </div>

        <div className="flex flex-col items-end w-full max-w-[46.875rem]">
          <div className="bg-white rounded-[0.5rem] shadow p-[1.5rem] w-full flex flex-col gap-[1.5rem]">
            <div className="flex flex-row items-center gap-[1rem] mt-[0.5rem] scale-[1.15] origin-left">
              {usuarioSelecionado ? (
                <div className="flex flex-col">
                  <UserInfo
                    nome={usuarioSelecionado.nome}
                    email={usuarioSelecionado.email}
                    copy={false}
                    active={usuarioSelecionado.isActive}
                  />
                </div>
              ) : (
                <h2 className="text-[1.5rem] font-bold text-foreground">
                  Selecione um aluno
                </h2>
              )}
            </div>



            <div className="mt-[1.5rem] pl-[0.5rem] pr-[1rem] space-y-[1.5rem]">
              <div>
                <Label className="text-[0.875rem] font-semibold text-foreground">Pontos positivos</Label>
                <Textarea
                  placeholder="Insira aqui os pontos positivos..."
                  className={`mt-[0.5rem] resize-none bg-card ${errosCampos.positivos ? "border-2 border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  value={secaoAtual.positivos}
                  onChange={(e) => handleChange("positivos", e.target.value)}
                />
                {errosCampos.positivos && (
                  <p className="text-[0.875rem] text-red-500 mt-[0.25rem]">
                    Este campo é obrigatório!
                  </p>
                )}
              </div>

              <div>
                <Label className="text-[0.875rem] font-semibold text-foreground">Pontos de melhoria</Label>
                <Textarea
                  placeholder="Insira aqui os pontos de melhoria..."
                  className={`mt-[0.5rem] resize-none bg-card ${errosCampos.melhoria ? "border-2 border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  value={secaoAtual.melhoria}
                  onChange={(e) => handleChange("melhoria", e.target.value)}
                />
                {errosCampos.melhoria && (
                  <p className="text-[0.875rem] text-red-500 mt-[0.25rem]">
                    Este campo é obrigatório!
                  </p>
                )}
              </div>

              <div>
                <Label className="text-[0.875rem] font-semibold text-foreground">Sugestões</Label>
                <Textarea
                  placeholder="Insira aqui as sugestões..."
                  className={`mt-[0.5rem] resize-none bg-card ${errosCampos.sugestoes ? "border-2 border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  value={secaoAtual.sugestoes}
                  onChange={(e) => handleChange("sugestoes", e.target.value)}
                />
                {errosCampos.sugestoes && (
                  <p className="text-[0.875rem] text-red-500 mt-[0.25rem]">
                    Este campo é obrigatório!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-[1.5rem] w-full">
            <div className="flex gap-[1rem]">
              <ButtonTT
                tooltip="Anterior"
                mode="default"
                onClick={() => trocarPagina(pagina - 1)}
                disabled={pagina === 0}
                className={`text-[0.875rem] leading-[1.25rem] bg-white text-black border border-gray-300 hover:bg-gray-100 px-[2rem] ${pagina === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Anterior
              </ButtonTT>

              <ButtonTT
                tooltip="Próximo"
                mode="default"
                onClick={() => trocarPagina(pagina + 1)}
                disabled={pagina === formulario.length - 1}
                className={`text-[0.875rem] leading-[1.25rem] bg-white text-black border border-gray-300 hover:bg-gray-100 px-[2rem] ${pagina === formulario.length - 1 ? "opacity-50 cursor-not-allowed" : ""
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
              className={`text-[0.875rem] leading-[1.25rem] px-[2rem] ${!todosPreenchidos ? "opacity-50 cursor-not-allowed" : ""
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
