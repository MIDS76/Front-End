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

type FeedbackTurma = {
  positivosTurma: string;
  melhoriaTurma: string;
  sugestoesTurma: string;
};

const FeedbackTurmaCard = ({
    feedback,
    handleChange,
    erros,
}: {
    feedback: FeedbackTurma;
    handleChange: (campo: keyof FeedbackTurma, valor: string) => void;
    erros: Record<keyof FeedbackTurma, boolean>;
}) => {
    
    const camposTurma: (keyof FeedbackTurma)[] = ["positivosTurma", "melhoriaTurma", "sugestoesTurma"];
    
    return (
        <div className="mt-6 pl-2 pr-4 space-y-6 flex-grow">
            {camposTurma.map((campo) => {
                const isError = erros[campo] === true;
                
                let labelText = "";
                let placeholderText = "";
                
                if (campo === "positivosTurma") {
                    labelText = "Pontos positivos da Turma";
                    placeholderText = "Insira aqui os pontos positivos da turma...";
                } else if (campo === "melhoriaTurma") {
                    labelText = "Pontos de melhoria da Turma";
                    placeholderText = "Insira aqui os pontos de melhoria da turma...";
                } else if (campo === "sugestoesTurma") {
                    labelText = "Sugestões para a Turma";
                    placeholderText = "Insira aqui as sugestões para a turma...";
                }

                return (
                    <div key={campo}>
                        <Label className="text-sm font-semibold" style={{ color: "hsl(var(--card-foreground))" }}>
                            {labelText}
                        </Label>
                        <Textarea
                            placeholder={placeholderText}
                            className="mt-2 resize-none"
                            style={{
                                backgroundColor: "hsl(var(--popover))",
                                color: "hsl(var(--popover-foreground))",
                                border: isError ? "2px solid hsl(var(--destructive))" : "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                minHeight: "4.5rem",
                            }}
                            value={feedback[campo]}
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
    );
};

export default function ConselhoCoordenacao() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formulario, setFormulario] = useState<CampoFormulario[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  
  const [exibirFeedbackTurma, setExibirFeedbackTurma] = useState(false); 
  
  const [feedbackTurma, setFeedbackTurma] = useState<FeedbackTurma>({
      positivosTurma: "",
      melhoriaTurma: "",
      sugestoesTurma: "",
  });

  const [errosCampos, setErrosCampos] = useState<Record<keyof CampoFormulario, boolean>>({
    titulo: false,
    positivos: false,
    melhoria: false,
    sugestoes: false,
  });
  
  const [errosTurma, setErrosTurma] = useState<Record<keyof FeedbackTurma, boolean>>({
      positivosTurma: false,
      melhoriaTurma: false,
      sugestoesTurma: false,
  });

  useEffect(() => {
    const alunosAtivos = usuariosData.filter((u) => u.role === "Aluno" && u.isActive);
    setUsuarios(alunosAtivos);

    const salvoRaw = localStorage.getItem("conselho-formulario");
    const salvoTurmaRaw = localStorage.getItem("conselho-turma");

    const inicial = alunosAtivos.map((aluno) => ({
      titulo: aluno.nome,
      positivos: "",
      melhoria: "",
      sugestoes: "",
    }));
    
    let formulariosAlinhados = inicial;
    if (salvoRaw) {
        try {
            const salvo: CampoFormulario[] = JSON.parse(salvoRaw);
            formulariosAlinhados = alunosAtivos.map((aluno) => {
                const achado = salvo.find((s) => s.titulo === aluno.nome);
                return achado ?? { titulo: aluno.nome, positivos: "", melhoria: "", sugestoes: "" };
            });
            localStorage.setItem("conselho-formulario", JSON.stringify(formulariosAlinhados));
        } catch {
            localStorage.setItem("conselho-formulario", JSON.stringify(inicial));
        }
    }
    setFormulario(formulariosAlinhados);

    let feedbackTurmaInicial = { positivosTurma: "", melhoriaTurma: "", sugestoesTurma: "" };
    if (salvoTurmaRaw) {
        try {
            feedbackTurmaInicial = JSON.parse(salvoTurmaRaw);
        } catch {}
    }
    setFeedbackTurma(feedbackTurmaInicial);
    
    setPagina(0);
    setUsuarioSelecionado(alunosAtivos[0] ?? null);

    const todosPreenchidos = formulariosAlinhados.length > 0 && formulariosAlinhados.every(
        (f) => f.positivos.trim() && f.melhoria.trim() && f.sugestoes.trim()
    );

    if (todosPreenchidos) {
        setExibirFeedbackTurma(true);
        setUsuarioSelecionado(null);
    }
    
  }, []);

  useEffect(() => {
    if (formulario.length > 0) {
      localStorage.setItem("conselho-formulario", JSON.stringify(formulario));
    }
  }, [formulario]);

  useEffect(() => {
    localStorage.setItem("conselho-turma", JSON.stringify(feedbackTurma));
  }, [feedbackTurma]);

  // Mantido o fix de salvamento
  const handleChange = (campo: keyof CampoFormulario, valor: string) => {
    const novoFormulario = [...formulario];
    if (pagina >= 0 && pagina < novoFormulario.length) {
      novoFormulario[pagina] = { ...novoFormulario[pagina], [campo]: valor };
      setFormulario(novoFormulario);
      setErrosCampos((prev) => ({ ...prev, [campo]: false }));
    }
  };

  const handleChangeTurma = (campo: keyof FeedbackTurma, valor: string) => {
      setFeedbackTurma((prev) => ({ ...prev, [campo]: valor }));
      setErrosTurma((prev) => ({ ...prev, [campo]: false }));
  };

  const validarCamposAluno = () => {
    if (!formulario || formulario.length === 0) return true;
    
    // Validar o formulário da PÁGINA ATUAL
    const secaoAtualForm = formulario[pagina];

    if (!secaoAtualForm) return true;
    
    const erros = {
      titulo: false,
      positivos: validateRequired(secaoAtualForm.positivos, "Pontos positivos") !== "",
      melhoria: validateRequired(secaoAtualForm.melhoria, "Pontos de melhoria") !== "", 
      sugestoes: validateRequired(secaoAtualForm.sugestoes, "Sugestões") !== "", 
    } as Record<keyof CampoFormulario, boolean>;
    
    setErrosCampos(erros);

    if (erros.positivos || erros.melhoria || erros.sugestoes) {
        toast.error("Por favor, preencha todos os campos do aluno atual antes de prosseguir.");
        return false;
    }
    return true;
  };

  const validarCamposTurma = () => {
      const erros = {
          positivosTurma: validateRequired(feedbackTurma.positivosTurma, "Pontos positivos da Turma") !== "",
          melhoriaTurma: validateRequired(feedbackTurma.melhoriaTurma, "Pontos de melhoria da Turma") !== "",
          sugestoesTurma: validateRequired(feedbackTurma.sugestoesTurma, "Sugestões para a Turma") !== "",
      } as Record<keyof FeedbackTurma, boolean>;
      
      setErrosTurma(erros);

      if (erros.positivosTurma || erros.melhoriaTurma || erros.sugestoesTurma) {
          toast.error("Por favor, preencha todos os campos obrigatórios para o Feedback da Turma.");
          return false;
      }
      return true;
  }

  const trocarPagina = (novaPagina: number) => {
    // BLOQUEIO RESTAURADO: Se tentar avançar, valida antes
    if (novaPagina > pagina) {
        if (!validarCamposAluno()) return; 
    }

    if (novaPagina < 0 || novaPagina >= formulario.length) {
        return; 
    }
    
    setErrosCampos({ titulo: false, positivos: false, melhoria: false, sugestoes: false });
    
    setExibirFeedbackTurma(false); 
    setPagina(novaPagina);
    setUsuarioSelecionado(usuarios[novaPagina] ?? null);
  };
  
  const handleTransitionToTurma = () => {
      // Verifica o último aluno antes de ir para a turma
      if (!validarCamposAluno()) return;

      const todosAlunosPreenchidos = formulario.every(
          (f) => f.positivos.trim() && f.melhoria.trim() && f.sugestoes.trim()
      );

      if (!todosAlunosPreenchidos) {
          toast.error("Você deve preencher todos os feedbacks dos alunos antes de passar para o Feedback da Turma.");
          return;
      }
      
      setExibirFeedbackTurma(true); 
      setUsuarioSelecionado(null);
  };

  const handleSelecionarUsuario = (usuarioClicado: Usuario) => {
      // BLOQUEIO RESTAURADO: Impede troca via lista se o atual estiver incompleto
      if (!validarCamposAluno()) return;

      const novaPagina = usuarios.findIndex((u) => u.nome === usuarioClicado.nome);
      
      if (novaPagina !== -1) {
          setExibirFeedbackTurma(false); 
          setPagina(novaPagina);
          setUsuarioSelecionado(usuarioClicado);
      }
  };

  const handleConcluir = () => {
    if (!validarCamposTurma()) return; 
    
    toast.success("Conselho concluído e salvo com sucesso!");
    localStorage.removeItem("conselho-formulario");
    localStorage.removeItem("conselho-turma");
    
    // Redireciona para a tela principal
    router.push("/pedagogico");
  };

  const alunosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(searchQueryUsuarios.toLowerCase())
  );

  const secaoAtual = formulario[pagina] ?? { titulo: "", positivos: "", melhoria: "", sugestoes: "" };

  const todosAlunosPreenchidos = formulario.length > 0 && formulario.every(
    (f) => f.positivos.trim() && f.melhoria.trim() && f.sugestoes.trim()
  );

  const todosTurmaPreenchidos = feedbackTurma.positivosTurma.trim() && feedbackTurma.melhoriaTurma.trim() && feedbackTurma.sugestoesTurma.trim();

  const camposAluno: (keyof CampoFormulario)[] = ["positivos", "melhoria", "sugestoes"];
  
  const proximoDesabilitado = pagina === formulario.length - 1;
  
  const enviarDesabilitado = exibirFeedbackTurma 
      ? !todosTurmaPreenchidos 
      : !todosAlunosPreenchidos;

  const proximoButtonColor = exibirFeedbackTurma || proximoDesabilitado 
    ? { backgroundColor: "#d2dbdc", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))" }
    : { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", border: `1px solid hsl(var(--primary))` };

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center overflow-auto lg:overflow-hidden px-4 xl:px-8 py-4 lg:py-0"
      style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
    >
      <div className="flex w-full max-w-[100rem] justify-center gap-4 xl:gap-8">
        
        {/* Primeira div - Lista de alunos */}
        <div className="flex flex-col flex-1 max-w-[46.875rem] min-w-0 gap-4">
          <InfoCard
            titulo="JGS - AI MIDS 2024/1 INT1"
            descricao="WEG - MI 76"
          />


          <div
            className="w-full h-[26rem] lg:h-[32rem] rounded-2xl shadow-inner overflow-hidden border"
            style={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          >
            <input 
                type="text"
                placeholder="Buscar um usuário"
                value={searchQueryUsuarios}
                onChange={(e) => setSearchQueryUsuarios(e.target.value)}
                className="w-full p-4 border-b focus:outline-none"
                style={{
                  backgroundColor: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  borderColor: "hsl(var(--border))"
                }}
            />
            <ScrollArea className="h-full w-full p-2">
              <Lista
                usuarios={alunosFiltrados}
                tipo="limpa"
                isDialogOpen={false}
                setIsDialogOpen={() => { }}
                className="flex flex-col gap-2"
                onSelect={handleSelecionarUsuario} 
                usuarioSelecionado={usuarioSelecionado}
              />
            </ScrollArea>
          </div>
        </div>

        {/* Segunda div - Formulário */}
        <div className="flex flex-col flex-1 max-w-[46.875rem] min-w-0">
          
          <div
            className="rounded-3xl shadow p-6 w-full flex flex-col gap-6 flex-grow"
            style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
          >
            {/* CONTAINER DO TÍTULO/USERINFO */}
            <div className="flex flex-row items-start justify-between gap-4 mt-2 scale-105 origin-left">
                
                {/* 1. User Info (Esquerda) */}
                <div className="flex-shrink-0">
                    {!exibirFeedbackTurma && usuarioSelecionado && (
                        <UserInfo
                            nome={usuarioSelecionado.nome}
                            email={usuarioSelecionado.email}
                            copy={false}
                            active={usuarioSelecionado.isActive}
                        />
                    )}
                </div>
                
                {/* 2. TÍTULO/SUBTÍTULO DA TURMA */}
                {!usuarioSelecionado && (
                    <div className="flex flex-col flex-shrink-0 w-full">
                        <div className="flex justify-between items-start">
                            {/* MI 76 (Esquerda) */}
                            <div className="text-2xl font-bold">MI 76</div>
                        </div>
                        {/* Curso: Desenvolvimento de Sistemas (Abaixo e Alinhado à esquerda) */}
                        <p className="text-sm font-normal text-left -mt-1">Curso: Desenvolvimento de Sistemas</p>
                    </div>
                )}
            </div>

            {/* RENDERIZAÇÃO CONDICIONAL */}
            {exibirFeedbackTurma ? (
                <FeedbackTurmaCard 
                    feedback={feedbackTurma} 
                    handleChange={handleChangeTurma} 
                    erros={errosTurma} 
                />
            ) : (
              // Card do Formulário do Aluno
              <div className="mt-6 pl-2 pr-4 space-y-6 flex-grow">
                {camposAluno.map((campo) => {
                  const isError = errosCampos[campo] === true;
                  return (
                    <div key={campo}>
                      <Label className="text-sm font-semibold" style={{ color: "hsl(var(--card-foreground))" }}>
                        {campo === "positivos" ? "Pontos positivos" : campo === "melhoria" ? "Pontos de melhoria" : "Sugestões"}
                      </Label>
                      <Textarea
                        placeholder={`Insira aqui os ${campo.replace("sugestoes", "sugestões")}...`}
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
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-between items-center pt-6 w-full">
            <div className="flex gap-4">
                
              {/* Botão ANTERIOR */}
              <ButtonTT
                tooltip="Anterior"
                mode="default"
                onClick={() => {
                    if (exibirFeedbackTurma) {
                        setExibirFeedbackTurma(false);
                        setPagina(formulario.length - 1); 
                        setUsuarioSelecionado(usuarios[formulario.length - 1] ?? null);
                    } else {
                        trocarPagina(pagina - 1);
                    }
                }}
                disabled={!exibirFeedbackTurma && pagina === 0} 
                className="text-sm px-8"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                  opacity: (!exibirFeedbackTurma && pagina === 0) ? 0.5 : 1, 
                  cursor: (!exibirFeedbackTurma && pagina === 0) ? "not-allowed" : "pointer",
                }}
              >
                Anterior
              </ButtonTT>

              {/* Botão PRÓXIMO */}
              <ButtonTT
                tooltip="Próximo aluno"
                mode="default"
                onClick={() => trocarPagina(pagina + 1)}
                disabled={exibirFeedbackTurma || proximoDesabilitado} 
                className="text-sm px-8"
                style={{
                  ...proximoButtonColor, 
                  opacity: (exibirFeedbackTurma || proximoDesabilitado) ? 0.5 : 1,
                  cursor: (exibirFeedbackTurma || proximoDesabilitado) ? "not-allowed" : "pointer",
                }}
              >
                Próximo
              </ButtonTT>
            </div>

            {/* Botão ENVIAR */}
            <ButtonTT
                tooltip={exibirFeedbackTurma ? "Enviar Conselho" : "Passar para Feedback da Turma"}
                mode="default"
                onClick={() => exibirFeedbackTurma ? setIsConfirmOpen(true) : handleTransitionToTurma()} 
                disabled={enviarDesabilitado}
                className="text-sm px-8"
                style={{
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  borderRadius: "var(--radius)",
                  opacity: enviarDesabilitado ? 0.5 : 1,
                  cursor: enviarDesabilitado ? "not-allowed" : "pointer",
                  border: `1px solid hsl(var(--primary))`,
                }}
              >
              Enviar
            </ButtonTT>
          </div>
        </div>
      </div>

      <ActionModal
        isOpen={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        title="Concluir e Enviar Conselho"
        description="Tem certeza que deseja enviar o conselho? Isso salvará os dados e limpará o progresso local. Você permanecerá nesta tela."
        actionButtonLabel="Enviar Conselho"
        onConfirm={() => {
            if (validarCamposTurma()) {
                handleConcluir();
                setIsConfirmOpen(false);
            }
        }}
      />
    </div>
  );
}