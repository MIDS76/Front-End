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
import { ScrollArea } from "@/components/ui/scroll-area";
import InfoCard from "@/components/card/cardTituloTelas";
import UserInfo from "@/components/lista/userInfo";
import Lista from "@/components/lista/lista";
import { showError, validateRequired } from "@/utils/formValidation";

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
  const [errosCampos, setErrosCampos] = useState<Record<keyof CampoFormulario, boolean>>({
    titulo: false,
    positivos: false,
    melhoria: false,
    sugestoes: false,
  });

  useEffect(() => {
    const alunosAtivos = usuariosData.filter((u) => u.role === "Aluno" && u.isActive);
    setUsuarios(alunosAtivos);

    const salvoRaw = localStorage.getItem("conselho-formulario");
    const inicial = alunosAtivos.map((aluno) => ({
      titulo: aluno.nome,
      positivos: "",
      melhoria: "",
      sugestoes: "",
    }));

    if (!salvoRaw) {
      setFormulario(inicial);
      setPagina(0);
      setUsuarioSelecionado(alunosAtivos[0] ?? null);
      return;
    }

    try {
      const salvo: CampoFormulario[] = JSON.parse(salvoRaw);
      const alinhado = alunosAtivos.map((aluno) => {
        const achado = salvo.find((s) => s.titulo === aluno.nome);
        return achado ?? { titulo: aluno.nome, positivos: "", melhoria: "", sugestoes: "" };
      });
      setFormulario(alinhado);
      setPagina(0);
      setUsuarioSelecionado(alunosAtivos[0] ?? null);
      localStorage.setItem("conselho-formulario", JSON.stringify(alinhado));
    } catch {
      setFormulario(inicial);
      setPagina(0);
      setUsuarioSelecionado(alunosAtivos[0] ?? null);
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
    const idx = Math.max(0, Math.min(pagina, novoFormulario.length - 1));
    novoFormulario[idx] = { ...novoFormulario[idx], [campo]: valor };
    setFormulario(novoFormulario);
    setErrosCampos((prev) => ({ ...prev, [campo]: false }));
  };

  const validarCampos = () => {
    if (!formulario || formulario.length === 0) return true;
    const secaoAtual = formulario[pagina] ?? { positivos: "", melhoria: "", sugestoes: "", titulo: "" };
    const erros = {
      titulo: false,
      positivos: validateRequired(secaoAtual.positivos, "Pontos positivos") !== "",
      melhoria: validateRequired(secaoAtual.melhoria, "Pontos positivos") !== "",
      sugestoes: validateRequired(secaoAtual.sugestoes, "Pontos positivos") !== "",
    } as Record<keyof CampoFormulario, boolean>;
    setErrosCampos(erros);

    if (erros.positivos || erros.melhoria || erros.sugestoes) {
      showError
      return false;
    }
    return true;
  };

  const trocarPagina = (novaPagina: number) => {
    if (novaPagina < 0 || novaPagina >= formulario.length) return;
    if (!validarCampos()) return;
    setPagina(novaPagina);
    setUsuarioSelecionado(usuarios[novaPagina] ?? null);
  };

  const handleConcluir = () => {
    if (!validarCampos()) return;
    toast.success("Conselho concluído e salvo com sucesso!");
    localStorage.removeItem("conselho-formulario");

    const usuarioJson = localStorage.getItem("user");

    if (usuarioJson) {
      try {
        const usuario = JSON.parse(usuarioJson);

        if (usuario && usuario.perfil) {
          setTimeout(() => router.push(`/${usuario.perfil}`), 800);
        }
      } catch (error) {
        toast.error("Erro ao recuperar os dados do usuário.");
      }
    }
  };

  const alunosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(searchQueryUsuarios.toLowerCase())
  );

  const secaoAtual = usuarioSelecionado
    ? formulario.find((f) => f.titulo === usuarioSelecionado.nome) ?? { titulo: "", positivos: "", melhoria: "", sugestoes: "" }
    : formulario[pagina] ?? { titulo: "", positivos: "", melhoria: "", sugestoes: "" };

  const todosPreenchidos = formulario.length > 0 && formulario.every(
    (f) => f.positivos.trim() && f.melhoria.trim() && f.sugestoes.trim()
  );

  const campos: (keyof CampoFormulario)[] = ["positivos", "melhoria", "sugestoes"];

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden px-8"
      style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
    >
      <div className="flex w-full max-w-[100rem] justify-center gap-8">
        {/* Primeira div - Lista de alunos */}
        <div className="flex flex-col w-full max-w-[46.875rem] gap-4">
          <InfoCard
            titulo="JGS - AI MIDS 2024/1 INT1"
            descricao="WEG - MI 76"
          />


          <div
            className="w-full h-[32rem] rounded-2xl shadow-inner overflow-hidden border"
            style={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          >
            <ScrollArea className="h-full w-full p-2">
              <Lista
                usuarios={alunosFiltrados}
                tipo="limpa"
                isDialogOpen={false}
                setIsDialogOpen={() => { }}
                className="flex flex-col gap-2"
                onSelect={(usuarioClicado: Usuario) => {
                  if (!validarCampos()) return;

                  const novaPagina = usuarios.findIndex((u) => u.nome === usuarioClicado.nome);
                  if (novaPagina !== -1) {
                    setPagina(novaPagina);
                    setUsuarioSelecionado(usuarioClicado);
                  }
                }}
                usuarioSelecionado={usuarioSelecionado}
              />
            </ScrollArea>
          </div>
        </div>

        {/* Segunda div - Formulário e botões */}
        <div className="flex flex-col w-full max-w-[46.875rem]">
          <div
            className="rounded-3xl shadow p-6 w-full flex flex-col gap-6 flex-grow"
            style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
          >
            {usuarioSelecionado && (
              <div className="flex flex-row items-center gap-4 mt-2 scale-105 origin-left">
                <UserInfo
                  nome={usuarioSelecionado.nome}
                  email={usuarioSelecionado.email}
                  copy={false}
                  active={usuarioSelecionado.isActive}
                />
              </div>
            )}

            <div className="mt-6 pl-2 pr-4 space-y-6 flex-grow">
              {campos.map((campo) => {
                const isError = errosCampos[campo] === true;
                return (
                  <div key={campo}>
                    <Label className="text-sm font-semibold" style={{ color: "hsl(var(--card-foreground))" }}>
                      {campo === "positivos" ? "Pontos positivos" : campo === "melhoria" ? "Pontos de melhoria" : "Sugestões de melhorias"}
                    </Label>
                    <Textarea
                      placeholder={`Insira aqui os ${campo}...`}
                      className="mt-2 resize-none"
                      style={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: isError ? "2px solid hsl(var(--destructive))" : "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        minHeight: "4.5rem",
                      }}
                      value={secaoAtual[campo]}
                      onChange={(e) => handleChange(campo, e.target.value)}
                    />
                    {isError && (
                      <p className="text-sm mt-1" style={{ color: "hsl(var(--destructive))" }}>
                        Este campo é obrigatório!
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between items-center pt-6 w-full">
            <div className="flex gap-4">
              <ButtonTT
                tooltip="Anterior"
                mode="default"
                onClick={() => trocarPagina(pagina - 1)}
                disabled={pagina === 0}
                className="text-sm px-8"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                  opacity: pagina === 0 ? 0.5 : 1,
                  cursor: pagina === 0 ? "not-allowed" : "pointer",
                }}
              >
                Anterior
              </ButtonTT>

              <ButtonTT
                tooltip="Próximo"
                mode="default"
                onClick={() => trocarPagina(pagina + 1)}
                disabled={pagina === formulario.length - 1}
                className="text-sm px-8"
                style={{
                  backgroundColor: "#d2dbdc", // Botei cor de fundo no botão
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                  opacity: pagina === formulario.length - 1 ? 0.5 : 1,
                  cursor: pagina === formulario.length - 1 ? "not-allowed" : "pointer",
                }}
              >
                Próximo
              </ButtonTT>
            </div>

            <ButtonTT
              tooltip="Concluir"
              mode="default"
              disabled={!todosPreenchidos}
              onClick={() => router.push('/feedbackTurma')}
              className="text-sm px-8"
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                borderRadius: "var(--radius)",
                opacity: !todosPreenchidos ? 0.5 : 1,
                cursor: !todosPreenchidos ? "not-allowed" : "pointer",
                border: `1px solid hsl(var(--primary))`,
              }}
            >
              Próximo passo
            </ButtonTT>
          </div>
        </div>
      </div>

      <ActionModal
        isOpen={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        title="Concluir conselho"
        description="Tem certeza que deseja concluir e limpar os dados salvos?"
        actionButtonLabel="Concluir"
        onConfirm={() => {
          handleConcluir();
          setIsConfirmOpen(false);
        }}
      />
    </div>
  );
}